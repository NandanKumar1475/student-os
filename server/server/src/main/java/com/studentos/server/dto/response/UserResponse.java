package com.studentos.server.dto.response;

import com.studentos.server.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String college;
    private String branch;
    private Integer year;
    private String careerGoal;
    private String avatarUrl;
    private Role role;
}