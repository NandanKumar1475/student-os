package com.studentos.server.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String body;
    private String link;
    private Boolean read;
}
