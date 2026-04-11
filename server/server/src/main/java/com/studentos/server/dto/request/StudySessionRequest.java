package com.studentos.server.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudySessionRequest {

    @NotNull(message = "Minutes is required")
    @Min(value = 1, message = "Minutes must be at least 1")
    private Integer minutes;
}
