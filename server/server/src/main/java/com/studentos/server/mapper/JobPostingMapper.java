package com.studentos.server.mapper;

import com.studentos.server.dto.response.JobPostingResponse;
import com.studentos.server.entity.JobPosting;

public class JobPostingMapper {

    public static JobPostingResponse toResponse(JobPosting posting) {
        return JobPostingResponse.builder()
                .id(posting.getId())
                .title(posting.getTitle())
                .company(posting.getCompany())
                .location(posting.getLocation())
                .description(posting.getDescription())
                .externalUrl(posting.getExternalUrl())
                .type(posting.getType())
                .source("Admin")
                .postedByName(posting.getPostedBy() != null ? posting.getPostedBy().getName() : null)
                .active(posting.getActive())
                .build();
    }
}
