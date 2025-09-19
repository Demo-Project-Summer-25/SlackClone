package com.hire_me.Ping.dms.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

// This class maps to the "DIRECT_PARTICIPANT" table.
// It says which users are inside which DM.
@Entity
@Table(
    name = "DIRECT_PARTICIPANT",
    uniqueConstraints = @UniqueConstraint( // do not allow the same user in the same DM twice
        columnNames = {"DIRECT_CONVERSATION_ID", "USER_ID"}
    ),
    indexes = {
        @Index(name = "idx_participant_conversation", columnList = "DIRECT_CONVERSATION_ID"),
        @Index(name = "idx_participant_user", columnList = "USER_ID")
    }
)
public class DirectParticipant {
    
    // Primary key (UUID).
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;  // Changed from Long to UUID
    
    // Which DM this row belongs to (FK column kept for simple queries)
    @Column(name = "direct_conversation_id")
    private UUID directConversationId;  // Changed from Long to UUID
    
    // Which user is the participant.
    @Column(name = "user_id")
    private UUID userId;  // Should already be UUID
    
    // When the user joined the DM.
    @Column(name = "joined_at")
    private Instant joinedAt;
    
    // When the user left the DM. null = still in.
    @Column(name = "left_at")
    private Instant leftAt;
    
    // Is this user an admin of the DM (can add/remove others for groups).
    @Column(name = "is_admin")
    private boolean isAdmin;  // Added missing field

    // How much the user wants to be notified.
    // ALL = every message, MENTIONS = only @me, NONE = never.
    @Enumerated(EnumType.STRING)
    @Column(name = "notify_level")
    private NotifyLevel notifyLevel;  // Added missing field

    // Small list type for notify options.
    public enum NotifyLevel {
        ALL, MENTIONS_ONLY, NONE
    }

    // Default constructor
    public DirectParticipant() {
        this.id = UUID.randomUUID();
    }

    @PrePersist
    protected void onCreate() {
        if (joinedAt == null) {
            joinedAt = Instant.now();
        }
        if (notifyLevel == null) {
            notifyLevel = NotifyLevel.ALL;
        }
    }
    
    // --- getters/setters ---

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getDirectConversationId() { return directConversationId; }
    public void setDirectConversationId(UUID directConversationId) { this.directConversationId = directConversationId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public Instant getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }

    public Instant getLeftAt() { return leftAt; }
    public void setLeftAt(Instant leftAt) { this.leftAt = leftAt; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }

    public NotifyLevel getNotifyLevel() { return notifyLevel; }
    public void setNotifyLevel(NotifyLevel notifyLevel) { this.notifyLevel = notifyLevel; }
}
