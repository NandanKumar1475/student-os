package com.studentos.server.service;

import com.studentos.server.dto.request.TargetRequest;
import com.studentos.server.dto.response.TargetResponse;
import com.studentos.server.entity.Target;
import com.studentos.server.entity.User;
import com.studentos.server.enums.Status;
import com.studentos.server.enums.TargetType;
import com.studentos.server.exception.BadRequestException;
import com.studentos.server.exception.ResourceNotFoundException;
import com.studentos.server.mapper.TargetMapper;
import com.studentos.server.repository.TargetRepository;
import com.studentos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TargetService {

    private final TargetRepository targetRepository;
    private final UserRepository userRepository;

    // Get all targets for a user
    public List<TargetResponse> getAllTargets(String email) {
        User user = getUserByEmail(email);
        return targetRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(TargetMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Get targets by status
    public List<TargetResponse> getTargetsByStatus(String email, Status status) {
        User user = getUserByEmail(email);
        return targetRepository.findByUserIdAndStatusOrderByPriorityAsc(user.getId(), status)
                .stream()
                .map(TargetMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Get targets by type
    public List<TargetResponse> getTargetsByType(String email, TargetType type) {
        User user = getUserByEmail(email);
        return targetRepository.findByUserIdAndTypeOrderByCreatedAtDesc(user.getId(), type)
                .stream()
                .map(TargetMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Get single target
    public TargetResponse getTarget(String email, Long targetId) {
        User user = getUserByEmail(email);
        Target target = targetRepository.findByIdAndUserId(targetId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Target not found"));
        return TargetMapper.toResponse(target);
    }

    // Create target
    public TargetResponse createTarget(String email, TargetRequest request) {
        User user = getUserByEmail(email);

        Target target = Target.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .deadline(request.getDeadline())
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : Status.ACTIVE)
                .isFocused(false)
                .progressPercentage(0)
                .build();

        Target saved = targetRepository.save(target);
        return TargetMapper.toResponse(saved);
    }

    // Update target
    public TargetResponse updateTarget(String email, Long targetId, TargetRequest request) {
        User user = getUserByEmail(email);
        Target target = targetRepository.findByIdAndUserId(targetId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Target not found"));

        if (request.getTitle() != null) target.setTitle(request.getTitle());
        if (request.getDescription() != null) target.setDescription(request.getDescription());
        if (request.getType() != null) target.setType(request.getType());
        if (request.getDeadline() != null) target.setDeadline(request.getDeadline());
        if (request.getPriority() != null) target.setPriority(request.getPriority());
        if (request.getStatus() != null) target.setStatus(request.getStatus());

        Target updated = targetRepository.save(target);
        return TargetMapper.toResponse(updated);
    }

    // Delete target
    public void deleteTarget(String email, Long targetId) {
        User user = getUserByEmail(email);
        Target target = targetRepository.findByIdAndUserId(targetId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Target not found"));
        targetRepository.delete(target);
    }

    // Toggle focus mode
    @Transactional
    public TargetResponse toggleFocus(String email, Long targetId) {
        User user = getUserByEmail(email);
        Target target = targetRepository.findByIdAndUserId(targetId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Target not found"));

        if (target.getStatus() != Status.ACTIVE) {
            throw new BadRequestException("Can only focus on active targets");
        }

        // If this target is already focused, unfocus it
        if (target.getIsFocused()) {
            target.setIsFocused(false);
            Target saved = targetRepository.save(target);
            return TargetMapper.toResponse(saved);
        }

        // Unfocus any currently focused target
        Optional<Target> currentlyFocused = targetRepository.findByUserIdAndIsFocusedTrue(user.getId());
        currentlyFocused.ifPresent(t -> {
            t.setIsFocused(false);
            targetRepository.save(t);
        });

        // Focus the requested target
        target.setIsFocused(true);
        Target saved = targetRepository.save(target);
        return TargetMapper.toResponse(saved);
    }

    // Update progress
    public TargetResponse updateProgress(String email, Long targetId, Integer progress) {
        User user = getUserByEmail(email);
        Target target = targetRepository.findByIdAndUserId(targetId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Target not found"));

        if (progress < 0 || progress > 100) {
            throw new BadRequestException("Progress must be between 0 and 100");
        }

        target.setProgressPercentage(progress);

        // Auto-complete if 100%
        if (progress == 100) {
            target.setStatus(Status.COMPLETED);
            target.setIsFocused(false);
        }

        Target saved = targetRepository.save(target);
        return TargetMapper.toResponse(saved);
    }

    // Helper
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}