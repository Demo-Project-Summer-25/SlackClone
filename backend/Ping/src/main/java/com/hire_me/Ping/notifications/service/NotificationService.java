package com.hire_me.Ping.notifications.service;

import com.hire_me.Ping.notifications.dto.CountResponse;
import com.hire_me.Ping.notifications.dto.ListNotificationsRequest;
import com.hire_me.Ping.notifications.dto.MarkReadRequest;
import com.hire_me.Ping.notifications.dto.NotificationResponse;
import com.hire_me.Ping.notifications.entity.Notification;
import com.hire_me.Ping.notifications.entity.NotificationStatus;
import com.hire_me.Ping.notifications.entity.NotificationType;
import com.hire_me.Ping.notifications.repository.NotificationRepository;
import com.hire_me.Ping.notifications.mapper.NotificationMapper;
// TODO: Provide NotificationPublisher implementation if using websockets
import com.hire_me.Ping.notifications.ws.NotificationPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPublisher notificationPublisher;
    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationPublisher notificationPublisher,
                               NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationPublisher = notificationPublisher;
        this.notificationMapper = notificationMapper;
    }

    // ============================================================
    // CREATE
    // ============================================================

    /**
     * Create and persist a new notification, then push a tiny real-time payload.
     * Keep it small and focused: DB write first, then WS push.
     */
    @Transactional
    public NotificationResponse createNotification(
            UUID recipientUserId,
            UUID actorUserId,
            UUID directConversationId,
            UUID channelId,
            UUID messageId,
            NotificationType type,
            String text
    ) {
        // Build an entity using our factory helper (keeps defaults consistent)
        Notification entity;
        if (directConversationId != null) {
            entity = Notification.forDirectMessage(
                    recipientUserId,
                    actorUserId,
                    directConversationId,
                    messageId,
                    text
            );
        } else {
            // Generic non-DM notification (e.g., channel context)
            entity = Notification.generic(
                    recipientUserId,
                    actorUserId,
                    channelId,
                    messageId,
                    type,
                    text
            );
        }

        // Save in DB
        Notification saved = notificationRepository.save(entity);

        // Publish a tiny WS payload (id, text, createdAt) to the recipient's private channel
        notificationPublisher.publishNewNotification(saved.getRecipientUserId(), saved.getId(), saved.getText(), saved.getCreatedAt());

        // Return the API DTO
        return notificationMapper.toResponse(saved);
    }

    // ============================================================
    // READ (LIST + COUNT)
    // ============================================================

    /**
     * List notifications for a user, newest first.
     * For MVP we keep paging simple with just a 'limit'. You can add cursor later.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> listNotifications(UUID userId, ListNotificationsRequest req) {
        List<Notification> rows;

        if (req != null && req.status() != null && req.status() != ListNotificationsRequest.Status.ALL) {
            // Only UNREAD requested
            rows = notificationRepository.findByRecipientUserIdAndStatusOrderByCreatedAtDesc(
                    userId, NotificationStatus.UNREAD
            );
        } else {
            // ALL requested
            rows = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
        }

        // Apply naive limit on top (DB-level paging can be added later)
        int limit = (req != null && req.limit() != null && req.limit() > 0 && req.limit() <= 100)
                ? req.limit()
                : 20;
        if (rows.size() > limit) {
            rows = rows.subList(0, limit);
        }

        return rows.stream().map(notificationMapper::toResponse).toList();
    }

    /**
     * Simple unread count for the badge.
     */
    @Transactional(readOnly = true)
    public CountResponse countUnread(UUID userId) {
        long unread = notificationRepository.countByRecipientUserIdAndStatus(userId, NotificationStatus.UNREAD);
        return new CountResponse(unread);
    }

    // ============================================================
    // UPDATE (MARK READ)
    // ============================================================

    /**
     * Mark a single notification as READ for this user.
     * Returns true if updated (1 row), false if nothing matched.
     */
    @Transactional
    public boolean markAsRead(UUID userId, UUID notificationId) {
        int changed = notificationRepository.markAsRead(notificationId, userId, OffsetDateTime.now());
        return changed == 1;
    }

    /**
     * Mark all UNREAD notifications for this user as READ.
     * Returns the number of rows updated (could be 0).
     */
    @Transactional
    public int markAllAsRead(UUID userId) {
        return notificationRepository.markAllAsRead(userId, OffsetDateTime.now());
    }

    // ============================================================
    // HELPERS (OPTIONAL)
    // ============================================================

    /**
     * Compose a short, user-facing line once, at creation time.
     * Keeping text "render-ready" makes the client simple and fast.
     */
    public String composeTextForDM(String actorDisplayName, String recipientDisplayName) {
        // Example: "Alice sent a message to Bob"
        return actorDisplayName + " sent a message to " + recipientDisplayName;
    }
}
