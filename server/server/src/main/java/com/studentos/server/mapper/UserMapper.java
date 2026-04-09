package com.studentos.server.mapper;

import com.studentos.server.dto.response.UserResponse;
import com.studentos.server.entity.User;

public class UserMapper {

    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .college(user.getCollege())
                .branch(user.getBranch())
                .year(user.getYear())
                .careerGoal(user.getCareerGoal())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .build();
    }
}