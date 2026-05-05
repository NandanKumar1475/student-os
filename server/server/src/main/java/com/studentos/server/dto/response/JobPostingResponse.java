package com.studentos.server.dto.response;

import com.studentos.server.enums.OpportunityType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobPostingResponse {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String description;
    private String externalUrl;
    private OpportunityType type;
    private String source;
    private String postedByName;
    private Boolean active;
}
