package com.hire_me.Ping.notifications.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;  // Add this import
import org.springframework.transaction.annotation.Transactional;

import com.hire_me.Ping.notifications.entity.Notification;
import com.hire_me.Ping.notifications.entity.NotificationStatus;

/**
 * Repository = librarian for Notification table.
 * Knows how to fetch and update rows, but has no business logic.
 */
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(UUID recipientUserId);

    /**
     * Same as above but filtered by status (UNREAD or READ).
     */
    List<Notification> findByRecipientUserIdAndStatusOrderByCreatedAtDesc(
            UUID recipientUserId,
            NotificationStatus status
    );

    /**
     * Count how many unread notifications a user has.
     */
    long countByRecipientUserIdAndStatus(UUID recipientUserId, NotificationStatus status);

    // Add this method to your NotificationRepository interface:
    long countByRecipientUserId(UUID recipientUserId);

    // Also add this method if it doesn't exist:
    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.recipientUserId = :recipientUserId")
    void deleteByRecipientUserId(@Param("recipientUserId") UUID recipientUserId);

    // ---- UPDATES ----

    /**
     * Mark a single notification as READ and set readAt timestamp.
     * @Modifying tells Spring this is an update, not a SELECT.
     * @Transactional makes sure the update happens inside a DB transaction.
     */
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.status = :readStatus, n.readAt = :readAt " +
           "WHERE n.id = :notificationId AND n.recipientUserId = :recipientUserId")
    int markAsRead(UUID notificationId, UUID recipientUserId, OffsetDateTime readAt, NotificationStatus readStatus);

    /**
     * Mark all notifications for a user as READ.
     */
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.status = :readStatus, n.readAt = :readAt " +
           "WHERE n.recipientUserId = :recipientUserId AND n.status = :unreadStatus")
    int markAllAsRead(UUID recipientUserId, OffsetDateTime readAt, NotificationStatus readStatus, NotificationStatus unreadStatus);
}
