package com.studentos.server.controller;

import com.studentos.server.dto.response.JobPostingResponse;
import com.studentos.server.enums.OpportunityType;
import com.studentos.server.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobPostingResponse>> getJobs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) OpportunityType type) {
        List<JobPostingResponse> jobs = jobService.getJobsForUser(userDetails.getUsername(), type);
        return ResponseEntity.ok(jobs);
    }
}
