package com.studentos.server.dto.request;

import com.studentos.server.enums.Priority;
import com.studentos.server.enums.Status;
import com.studentos.server.enums.TargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TargetRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Target type is required")
    private TargetType type;

    private LocalDate deadline;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private Status status;
}