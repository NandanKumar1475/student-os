package com.studentos.server.controller;

import com.studentos.server.dto.request.JobPostingRequest;
import com.studentos.server.dto.response.ApiResponse;
import com.studentos.server.dto.response.JobPostingResponse;
import com.studentos.server.enums.OpportunityType;
import com.studentos.server.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/jobs")
@RequiredArgsConstructor
public class AdminJobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobPostingResponse> createJobPosting(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobPostingRequest request) {
        JobPostingResponse response = jobService.createAdminPosting(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<JobPostingResponse>> getAdminPostings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) OpportunityType type) {
        List<JobPostingResponse> jobs = jobService.getAdminPostings(type);
        return ResponseEntity.ok(jobs);
    }
}
