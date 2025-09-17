package com.hire_me.Ping.notifications.ws;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Abstraction to publish lightweight real-time notification events.
 */
public interface NotificationPublisher {
    void publishNewNotification(UUID recipientUserId, UUID notificationId, String text, OffsetDateTime createdAt);
}
