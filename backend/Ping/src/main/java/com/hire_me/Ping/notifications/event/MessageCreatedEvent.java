package com.hire_me.Ping.notifications.event;
import java.util.UUID;
import com.hire_me.Ping.notifications.entity.NotificationType;

/**
 * Application event fired when a new message is created.
 * Carries enough context to build a notification.
 */
public record MessageCreatedEvent(
        UUID actorUserId,
        UUID recipientUserId,
        UUID directConversationId,
        UUID channelId,
        UUID messageId,
        NotificationType type,
        String text
) {}

