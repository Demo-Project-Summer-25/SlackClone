package com.hire_me.Ping.notifications.ws;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import static com.hire_me.Ping.notifications.ws.NotificationChannels.USER_QUEUE_NOTIFICATIONS;

/**
 * Sends real-time notification payloads over STOMP/WebSocket.
 *
 * Your NotificationService calls publishNewNotification(...) right after
 * the notification is saved to the database.
 *
 * Clients should subscribe to: /user/queue/notifications
 * (Requires WebSocket config with setUserDestinationPrefix("/user"))
 */
@Component
public class NotificationPublisher {

    private final SimpMessagingTemplate template;

    public NotificationPublisher(SimpMessagingTemplate template) {
        this.template = template;
    }

    /**
     * Push a minimal "new notification" payload to a single user.
     * Principal name in the WS session must equal recipientUserId.toString()
     * so Spring can route to that user's queue.
     */
    public void publishNewNotification(UUID recipientUserId, UUID notificationId, String text, OffsetDateTime createdAt) {
        var payload = new NewNotificationPayload(notificationId, text, createdAt);
        template.convertAndSendToUser(recipientUserId.toString(), USER_QUEUE_NOTIFICATIONS, payload);
    }

    /** Tiny payload the frontend can prepend into its list and use to bump the badge. */
    public record NewNotificationPayload(
            UUID id,
            String text,
            OffsetDateTime createdAt
    ) {}
}

