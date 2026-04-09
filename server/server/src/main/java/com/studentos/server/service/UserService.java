package com.studentos.server.service;

import com.studentos.server.dto.request.ProfileUpdateRequest;
import com.studentos.server.dto.response.UserResponse;
import com.studentos.server.entity.User;
import com.studentos.server.exception.ResourceNotFoundException;
import com.studentos.server.mapper.UserMapper;
import com.studentos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.toResponse(user);
    }

    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getCollege() != null) user.setCollege(request.getCollege());
        if (request.getBranch() != null) user.setBranch(request.getBranch());
        if (request.getYear() != null) user.setYear(request.getYear());
        if (request.getCareerGoal() != null) user.setCareerGoal(request.getCareerGoal());

        User updated = userRepository.save(user);
        return UserMapper.toResponse(updated);
    }
}