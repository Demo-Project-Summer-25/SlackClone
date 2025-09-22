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
import java.util.Arrays;
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
        System.out.println("DEBUG: Looking for notifications for user: " + userId);
        
        List<Notification> rows;

        if (req != null && req.status() != null && req.status() != ListNotificationsRequest.Status.ALL) {
            System.out.println("DEBUG: Fetching UNREAD notifications only");
            rows = notificationRepository.findByRecipientUserIdAndStatusOrderByCreatedAtDesc(
                    userId, NotificationStatus.UNREAD
            );
        } else {
            System.out.println("DEBUG: Fetching ALL notifications");
            rows = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
        }

        System.out.println("DEBUG: Found " + rows.size() + " notifications");
        
        // Apply naive limit on top (DB-level paging can be added later)
        int limit = (req != null && req.limit() != null && req.limit() > 0 && req.limit() <= 100)
                ? req.limit()
                : 20;
        if (rows.size() > limit) {
            rows = rows.subList(0, limit);
        }

        List<NotificationResponse> result = rows.stream().map(notificationMapper::toResponse).toList();
        System.out.println("DEBUG: Returning " + result.size() + " notification responses");
        return result;
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
        int changed = notificationRepository.markAsRead(
            notificationId, 
            userId, 
            OffsetDateTime.now(),
            NotificationStatus.READ
        );
        return changed == 1;
    }

    /**
     * Mark all UNREAD notifications for this user as READ.
     * Returns the number of rows updated (could be 0).
     */
    @Transactional
    public int markAllAsRead(UUID userId) {
        return notificationRepository.markAllAsRead(
            userId, 
            OffsetDateTime.now(),
            NotificationStatus.READ,
            NotificationStatus.UNREAD
        );
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

    // Remove the @PostConstruct method and replace it with this simpler approach

    @Transactional
    public void createTestNotifications() {
        try {
            System.out.println("Creating test notifications for Jennifer...");
            
            UUID jenniferId = UUID.fromString("68973614-94db-4f98-9729-0712e0c5c0fa");
            
            // Delete existing notifications first
            notificationRepository.deleteByRecipientUserId(jenniferId);
            
            // Use the factory methods that exist in your Notification entity
            Notification notif1 = Notification.forDirectMessage(
                jenniferId,
                UUID.fromString("ae2d64e5-d825-49fc-91bb-f530be88ca84"),
                UUID.fromString("jenn-conv-youins-001"), // some conversation ID
                UUID.fromString("jenn-msg-youins-001"),  // some message ID
                "New direct message from Youins"
            );
            
            Notification notif2 = Notification.forDirectMessage(
                jenniferId,
                UUID.fromString("0c862291-6d43-47fc-8682-ae358658a5e4"),
                UUID.fromString("jenn-conv-sai-002"),    // some conversation ID
                UUID.fromString("jenn-msg-sai-001"),     // some message ID
                "New direct message from Sai"
            );
            
            // For channel mentions, use the generic factory
            Notification notif3 = Notification.generic(
                jenniferId,
                UUID.fromString("fff673d0-c4be-49fc-8342-6554a25d19ee"),
                UUID.fromString("63353300-1058-42be-a3c5-09e03f829391"), // channel ID
                null, // no specific message ID
                NotificationType.MENTION, // Make sure this enum value exists
                "You were mentioned in Spring Boot Lab"
            );
            
            Notification notif4 = Notification.generic(
                jenniferId,
                UUID.fromString("0d9d27d6-8977-46d8-b00a-2464a932aafe"),
                UUID.fromString("faecdb32-9123-480a-8a72-7d75b83857c5"), // channel ID
                null, // no specific message ID
                NotificationType.MENTION, // Make sure this enum value exists
                "You were mentioned in Passion Projects"
            );
            
            // Mark one as read for variety
            notif3.markRead();
            
            // Save all notifications
            notificationRepository.saveAll(Arrays.asList(notif1, notif2, notif3, notif4));
            
            System.out.println("Successfully created 4 test notifications for Jennifer");
            
            // Debug: verify they were saved
            List<Notification> saved = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(jenniferId);
            System.out.println("DEBUG: After saving, found " + saved.size() + " notifications in database");
            
        } catch (Exception e) {
            System.err.println("Error creating test notifications: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
