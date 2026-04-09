package com.studentos.server.controller;

import com.studentos.server.dto.request.ProfileUpdateRequest;
import com.studentos.server.dto.response.ApiResponse;
import com.studentos.server.dto.response.UserResponse;
import com.studentos.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = userService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileUpdateRequest request) {
        UserResponse updated = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(new ApiResponse(true, "Profile updated", updated));
    }
}