package com.studentos.server.dto.request;

import com.studentos.server.enums.OpportunityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JobPostingRequest {

    @NotBlank
    private String title;

    private String company;
    private String location;
    private String description;
    private String externalUrl;

    @NotNull
    private OpportunityType type;
}
