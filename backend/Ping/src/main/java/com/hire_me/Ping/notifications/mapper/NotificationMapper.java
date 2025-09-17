package com.hire_me.Ping.notifications.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.hire_me.Ping.notifications.dto.NotificationResponse;
import com.hire_me.Ping.notifications.entity.Notification;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification n) {
        if (n == null) return null;

        return new NotificationResponse(
                n.getId(),
                n.getText(),
                n.getType(),
                n.getStatus(),
                n.getCreatedAt(),
                n.getReadAt(),
                n.getMessageId(),
                n.getDirectConversationId(),
                n.getChannelId()
        );
    }

    public List<NotificationResponse> toResponses(List<Notification> list) {
        return (list == null || list.isEmpty()) ? List.of()
                : list.stream().map(this::toResponse).toList();
    }
}
