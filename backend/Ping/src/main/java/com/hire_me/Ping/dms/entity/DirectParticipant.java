package com.hire_me.Ping.dms.entity;

import jakarta.persistence.*;               // JPA annotations
import java.time.Instant;                   // time type

// This class maps to the "direct_participant" table.
// It says which users are inside which DM.
@Entity
@Table(
    name = "direct_participant",
    uniqueConstraints = @UniqueConstraint( // do not allow the same user in the same DM twice
        columnNames = {"conversation_id", "user_id"}
    ),
    indexes = {
        @Index(name = "idx_participant_conversation", columnList = "conversation_id"),
        @Index(name = "idx_participant_user", columnList = "user_id")
    }
)
public class DirectParticipant {
    // Primary key (auto number).
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which DM this row belongs to (FK column kept for simple queries)
    @Column(name = "conversation_id", nullable = false)
    private Long conversationId;

    // Helpful association to the conversation (read-only; uses same FK column)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false, insertable = false, updatable = false)
    private DirectConversation conversation;

    // Which user is the participant.
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Is this user an admin of the DM (can add/remove others for groups).
    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin = false;

    // When the user joined the DM.
    @Column(name = "joined_at", nullable = false)
    private Instant joinedAt = Instant.now();

    // When the user left the DM. null = still in.
    @Column(name = "left_at")
    private Instant leftAt;

    // How much the user wants to be notified.
    // ALL = every message, MENTIONS = only @me, MUTED = never.
    @Enumerated(EnumType.STRING)
    @Column(name = "notify_level", length = 16, nullable = false)
    private NotifyLevel notifyLevel = NotifyLevel.ALL;

    // Small list type for notify options.
    public enum NotifyLevel { ALL, MENTIONS, MUTED }

    // --- getters/setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public DirectConversation getConversation() { return conversation; }
    public void setConversation(DirectConversation conversation) { this.conversation = conversation; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }

    public Instant getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }

    public Instant getLeftAt() { return leftAt; }
    public void setLeftAt(Instant leftAt) { this.leftAt = leftAt; }

    public NotifyLevel getNotifyLevel() { return notifyLevel; }
    public void setNotifyLevel(NotifyLevel notifyLevel) { this.notifyLevel = notifyLevel; }
}
