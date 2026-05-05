package com.studentos.server.service;

import com.studentos.server.dto.request.JobPostingRequest;
import com.studentos.server.dto.response.JobPostingResponse;
import com.studentos.server.entity.JobPosting;
import com.studentos.server.entity.Target;
import com.studentos.server.entity.User;
import com.studentos.server.enums.OpportunityType;
import com.studentos.server.enums.TargetType;
import com.studentos.server.exception.BadRequestException;
import com.studentos.server.exception.ResourceNotFoundException;
import com.studentos.server.mapper.JobPostingMapper;
import com.studentos.server.repository.JobPostingRepository;
import com.studentos.server.repository.TargetRepository;
import com.studentos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobPostingRepository jobPostingRepository;
    private final TargetRepository targetRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<JobPostingResponse> getJobsForUser(String email, OpportunityType type) {
        User user = getUserByEmail(email);

        if (type == OpportunityType.RESOURCE) {
            return getAdminPostings(type);
        }

        List<JobPostingResponse> adminPosts = getAdminPostings(type);
        List<JobPostingResponse> external = fetchExternalJobMatches(user);

        return Stream.concat(adminPosts.stream(), external.stream())
                .collect(Collectors.toList());
    }

    public List<JobPostingResponse> getAdminPostings(OpportunityType type) {
        List<JobPosting> postings;
        if (type == null) {
            postings = jobPostingRepository.findByActiveTrueOrderByCreatedAtDesc();
        } else {
            postings = jobPostingRepository.findByTypeAndActiveTrueOrderByCreatedAtDesc(type);
        }
        return postings.stream()
                .map(JobPostingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobPostingResponse createAdminPosting(String email, JobPostingRequest request) {
        User user = getUserByEmail(email);
        if (user.getRole() == null || !"ADMIN".equals(user.getRole().name())) {
            throw new BadRequestException("Admin access required");
        }

        JobPosting posting = JobPosting.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .description(request.getDescription())
                .externalUrl(request.getExternalUrl())
                .type(request.getType())
                .postedBy(user)
                .active(true)
                .build();

        JobPosting saved = jobPostingRepository.save(posting);
        notificationService.broadcastNotification(
                String.format("New %s posted", request.getType().name().replaceAll("_", " ")),
                request.getTitle() + " at " + (request.getCompany() != null ? request.getCompany() : "our network"),
                request.getExternalUrl()
        );
        return JobPostingMapper.toResponse(saved);
    }

    private List<JobPostingResponse> fetchExternalJobMatches(User user) {
        String query = buildSearchQuery(user);
        if (query.isBlank()) {
            return Collections.emptyList();
        }

        try {
            String encoded = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String url = "https://remotive.io/api/remote-jobs?search=" + encoded;
            Map<?, ?> response = WebClient.create(url)
                    .get()
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            if (response == null || !response.containsKey("jobs")) {
                return Collections.emptyList();
            }

            Object jobsObj = response.get("jobs");
            if (!(jobsObj instanceof List<?> jobs)) {
                return Collections.emptyList();
            }

            return jobs.stream()
                    .filter(Objects::nonNull)
                    .limit(10)
                    .map(item -> {
                        if (!(item instanceof Map<?, ?> jobMap)) {
                            return null;
                        }
                        String title = toString(jobMap.get("title"));
                        String company = toString(jobMap.get("company_name"));
                        String location = toString(jobMap.get("candidate_required_location"));
                        String description = toString(jobMap.get("description"));
                        String urlField = toString(jobMap.get("url"));

                        return JobPostingResponse.builder()
                                .id(null)
                                .title(title)
                                .company(company)
                                .location(location)
                                .description(description != null ? description.replaceAll("\\<.*?\\>", " ") : null)
                                .externalUrl(urlField)
                                .type(OpportunityType.JOB)
                                .source("Remote")
                                .postedByName("Remotive")
                                .active(true)
                                .build();
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }

    private String buildSearchQuery(User user) {
        List<Target> skills = targetRepository.findByUserIdAndTypeOrderByCreatedAtDesc(user.getId(), TargetType.SKILL);
        Stream<String> skillWords = skills.stream()
                .map(Target::getTitle)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .limit(5);

        String careerGoal = user.getCareerGoal();
        return Stream.concat(skillWords, Stream.of(careerGoal))
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .collect(Collectors.joining(" "));    }

    private String toString(Object value) {
        return value == null ? null : value.toString();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
