package com.hire_me.Ping.notifications.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;


@Entity
@Table(
    name = "notification",
    uniqueConstraints = {
        // Prevent duplicate notifications for the same recipient about the same message
        @UniqueConstraint(name = "uq_notification_recipient_message",
                          columnNames = {"recipient_user_id", "message_id"})
    },
    indexes = {
        // Fast "my unread, newest first"
        @Index(name = "ix_notification_recipient_status_created",
               columnList = "recipient_user_id,status,created_at"),
        // Fast history listing
        @Index(name = "ix_notification_recipient_created",
               columnList = "recipient_user_id,created_at")
    }
)
public class Notification {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    // ---- WHO ----
    @Column(name = "recipient_user_id", nullable = false, updatable = false)
    private UUID recipientUserId;      // who will see this notification

    @Column(name = "actor_user_id", nullable = false, updatable = false)
    private UUID actorUserId;          // who caused it (sender)

    // ---- WHERE/WHAT CONTEXT ----
    @Column(name = "direct_conversation_id")     // MVP: DMs
    private UUID directConversationId;

    @Column(name = "channel_id")                  // later: channels
    private UUID channelId;

    @Column(name = "message_id")                  // message that triggered this
    private UUID messageId;

    // ---- TYPE & STATUS ----
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 32)
    private NotificationType type = NotificationType.MESSAGE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 16)
    private NotificationStatus status = NotificationStatus.UNREAD;

    // ---- DISPLAY TEXT ----
    @Column(name = "text", nullable = false, length = 280)
    private String text;  // keep it short; render-ready

    // ---- TIMESTAMPS ----
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "read_at")
    private OffsetDateTime readAt;

    // ----- CONSTRUCTORS -----
    protected Notification() {
        // JPA needs a no-arg constructor
    }

    private Notification(
            UUID id,
            UUID recipientUserId,
            UUID actorUserId,
            UUID directConversationId,
            UUID channelId,
            UUID messageId,
            NotificationType type,
            NotificationStatus status,
            String text,
            OffsetDateTime createdAt,
            OffsetDateTime readAt
    ) {
        this.id = id;
        this.recipientUserId = recipientUserId;
        this.actorUserId = actorUserId;
        this.directConversationId = directConversationId;
        this.channelId = channelId;
        this.messageId = messageId;
        this.type = type;
        this.status = status;
        this.text = text;
        this.createdAt = createdAt;
        this.readAt = readAt;
    }

    // ----- FACTORY HELPERS (readable "constructors") -----

    /**
     * Create a simple MESSAGE notification for a DM.
     * Use this in your service/event handler.
     */
    public static Notification forDirectMessage(
            UUID recipientUserId,
            UUID actorUserId,
            UUID directConversationId,
            UUID messageId,
            String text
    ) {
        var now = OffsetDateTime.now();
        return new Notification(
                UUID.randomUUID(),         // generate id here (simpler than generator config)
                recipientUserId,
                actorUserId,
                directConversationId,
                null,                      // channelId not used for DMs
                messageId,
                NotificationType.MESSAGE,
                NotificationStatus.UNREAD, // default state
                text,
                now,
                null
        );
    }

    /**
     * Generic factory for non-DM notifications (e.g., channel or other context).
     */
    public static Notification generic(
            UUID recipientUserId,
            UUID actorUserId,
            UUID channelId,
            UUID messageId,
            NotificationType type,
            String text
    ) {
        var now = OffsetDateTime.now();
        return new Notification(
                UUID.randomUUID(),
                recipientUserId,
                actorUserId,
                null,              // directConversationId not used
                channelId,
                messageId,
                type != null ? type : NotificationType.MESSAGE,
                NotificationStatus.UNREAD,
                text,
                now,
                null
        );
    }

    // ----- BEHAVIOR HELPERS -----

    /** Mark this notification as read; set readAt timestamp. */
    public void markRead() {
        if (this.status != NotificationStatus.READ) {
            this.status = NotificationStatus.READ;
            this.readAt = OffsetDateTime.now();
        }
    }

    // ----- GETTERS / SETTERS (generate or write minimal ones you need) -----

    public UUID getId() { return id; }
    public UUID getRecipientUserId() { return recipientUserId; }
    public UUID getActorUserId() { return actorUserId; }
    public UUID getDirectConversationId() { return directConversationId; }
    public UUID getChannelId() { return channelId; }
    public UUID getMessageId() { return messageId; }
    public NotificationType getType() { return type; }
    public NotificationStatus getStatus() { return status; }
    public String getText() { return text; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getReadAt() { return readAt; }

    public void setText(String text) { this.text = text; } // generally immutable; allow only if needed

    // ----- LIFECYCLE HOOKS -----

    /**
     * Set defaults right before insert if someone forgot to call the factory.
     */
    @PrePersist
    protected void onCreate() {
        if (this.id == null) this.id = UUID.randomUUID();
        if (this.createdAt == null) this.createdAt = OffsetDateTime.now();
        if (this.status == null) this.status = NotificationStatus.UNREAD;
        if (this.type == null) this.type = NotificationType.MESSAGE;
    }
}
