package com.studentos.server.dto.response;

import com.studentos.server.enums.Priority;
import com.studentos.server.enums.Status;
import com.studentos.server.enums.TargetType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TargetResponse {
    private Long id;
    private String title;
    private String description;
    private TargetType type;
    private LocalDate deadline;
    private Priority priority;
    private Status status;
    private Boolean isFocused;
    private Integer progressPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}