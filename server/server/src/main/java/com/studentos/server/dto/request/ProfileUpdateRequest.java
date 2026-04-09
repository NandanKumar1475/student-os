package com.studentos.server.dto.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String college;
    private String branch;
    private Integer year;
    private String careerGoal;
}