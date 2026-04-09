package com.studentos.server.mapper;

import com.studentos.server.dto.response.TargetResponse;
import com.studentos.server.entity.Target;

public class TargetMapper {

    public static TargetResponse toResponse(Target target) {
        return TargetResponse.builder()
                .id(target.getId())
                .title(target.getTitle())
                .description(target.getDescription())
                .type(target.getType())
                .deadline(target.getDeadline())
                .priority(target.getPriority())
                .status(target.getStatus())
                .isFocused(target.getIsFocused())
                .progressPercentage(target.getProgressPercentage())
                .createdAt(target.getCreatedAt())
                .updatedAt(target.getUpdatedAt())
                .build();
    }
}