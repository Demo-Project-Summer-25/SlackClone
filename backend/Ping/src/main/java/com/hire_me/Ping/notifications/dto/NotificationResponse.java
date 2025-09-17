package com.hire_me.Ping.notifications.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.hire_me.Ping.notifications.entity.NotificationStatus;
import com.hire_me.Ping.notifications.entity.NotificationType;

/**
 * What the client receives when listing notifications.
 * Keep this small and stable; add fields carefully.
 */
public record NotificationResponse(
        UUID id,                          // notification id
        String text,                      // render-ready line: "Alice sent a message to Bob"
        NotificationType type,            // MESSAGE, MENTION, ...
        NotificationStatus status,        // UNREAD or READ
        OffsetDateTime createdAt,         // when created
        OffsetDateTime readAt,            // null if unread

        // --- Light context for deep-linking (nullable) ---
        UUID messageId,
        UUID directConversationId,
        UUID channelId

        // LATER (commented ideas):
        // UUID cardId,
        // UUID boardId,
        // String actorDisplayName,
        // String actorAvatarUrl
) {}

