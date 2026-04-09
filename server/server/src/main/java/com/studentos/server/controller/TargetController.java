package com.studentos.server.controller;

import com.studentos.server.dto.request.TargetRequest;
import com.studentos.server.dto.response.ApiResponse;
import com.studentos.server.dto.response.TargetResponse;
import com.studentos.server.enums.Status;
import com.studentos.server.enums.TargetType;
import com.studentos.server.service.TargetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/targets")
@RequiredArgsConstructor
public class TargetController {

    private final TargetService targetService;

    // GET /api/targets — get all targets (optional filters: ?status=ACTIVE&type=EXAM)
    @GetMapping
    public ResponseEntity<List<TargetResponse>> getAllTargets(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) TargetType type) {

        List<TargetResponse> targets;

        if (status != null) {
            targets = targetService.getTargetsByStatus(userDetails.getUsername(), status);
        } else if (type != null) {
            targets = targetService.getTargetsByType(userDetails.getUsername(), type);
        } else {
            targets = targetService.getAllTargets(userDetails.getUsername());
        }

        return ResponseEntity.ok(targets);
    }

    // GET /api/targets/{id} — get single target
    @GetMapping("/{id}")
    public ResponseEntity<TargetResponse> getTarget(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        TargetResponse target = targetService.getTarget(userDetails.getUsername(), id);
        return ResponseEntity.ok(target);
    }

    // POST /api/targets — create target
    @PostMapping
    public ResponseEntity<TargetResponse> createTarget(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TargetRequest request) {
        TargetResponse target = targetService.createTarget(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(target);
    }

    // PUT /api/targets/{id} — update target
    @PutMapping("/{id}")
    public ResponseEntity<TargetResponse> updateTarget(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody TargetRequest request) {
        TargetResponse target = targetService.updateTarget(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(target);
    }

    // DELETE /api/targets/{id} — delete target
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteTarget(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        targetService.deleteTarget(userDetails.getUsername(), id);
        return ResponseEntity.ok(new ApiResponse(true, "Target deleted successfully"));
    }

    // PUT /api/targets/{id}/focus — toggle focus mode
    @PutMapping("/{id}/focus")
    public ResponseEntity<TargetResponse> toggleFocus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        TargetResponse target = targetService.toggleFocus(userDetails.getUsername(), id);
        return ResponseEntity.ok(target);
    }

    // PUT /api/targets/{id}/progress — update progress
    @PutMapping("/{id}/progress")
    public ResponseEntity<TargetResponse> updateProgress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Integer progress = body.get("progress");
        TargetResponse target = targetService.updateProgress(userDetails.getUsername(), id, progress);
        return ResponseEntity.ok(target);
    }
}