package com.hire_me.Ping.messages.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
  name = "message",
  indexes = {
    @Index(name = "idx_msg_channel_created", columnList = "channel_id, created_at"),
    @Index(name = "idx_msg_dm_created", columnList = "direct_conversation_id, created_at"),
    @Index(name = "idx_msg_sender_created", columnList = "sender_user_id, created_at"),
    @Index(name = "idx_msg_created_at", columnList = "created_at"),
    @Index(name = "idx_msg_deleted", columnList = "deleted")
  }
)
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;  // Should already be UUID
    
    @Column(name = "content")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "content_type")
    private ContentType contentType;
    
    @Column(name = "sender_user_id")
    private UUID senderUserId;  // Should already be UUID
    
    @Column(name = "channel_id")
    private UUID channelId;  // Keep as Long for channels
    
    @Column(name = "direct_conversation_id")
    private UUID directConversationId;  // Changed from Long to UUID
    
    @Column(name = "created_at")
    private Instant createdAt;
    
    @Column(name = "edited_at")
    private Instant editedAt;
    
    @Column(name = "deleted")
    private boolean deleted;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
    
    public enum ContentType {
        TEXT, IMAGE, FILE, SYSTEM
    }
    
    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public ContentType getContentType() { return contentType; }
    public void setContentType(ContentType contentType) { this.contentType = contentType; }
    
    public UUID getSenderUserId() { return senderUserId; }
    public void setSenderUserId(UUID senderUserId) { this.senderUserId = senderUserId; }
    
    public UUID getChannelId() { return channelId; }
    public void setChannelId(UUID channelId) { this.channelId = channelId; }
    
    public UUID getDirectConversationId() { return directConversationId; }
    public void setDirectConversationId(UUID directConversationId) { this.directConversationId = directConversationId; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getEditedAt() { return editedAt; }
    public void setEditedAt(Instant editedAt) { this.editedAt = editedAt; }
    
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}