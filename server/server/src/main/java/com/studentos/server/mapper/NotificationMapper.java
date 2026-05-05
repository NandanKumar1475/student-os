package com.studentos.server.mapper;

import com.studentos.server.dto.response.NotificationResponse;
import com.studentos.server.entity.Notification;

public class NotificationMapper {

    public static NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .body(notification.getBody())
                .link(notification.getLink())
                .read(notification.getIsRead())
                .build();
    }
}
