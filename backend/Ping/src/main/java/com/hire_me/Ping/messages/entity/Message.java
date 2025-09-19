package com.hire_me.Ping.messages.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
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
  @Column(name = "ID")
  private UUID id;

  @Column(name = "CHANNEL_ID")
  private Long channelId; // Keep Long since Channel entity uses Long

  @Column(name = "DIRECT_CONVERSATION_ID")
  private UUID directConversationId;

  @Column(name = "SENDER_USER_ID")
  private UUID senderUserId;

  @Column(name = "CONTENT")
  private String content;

  @Enumerated(EnumType.STRING)
  @Column(name = "CONTENT_TYPE")
  private ContentType contentType;

  @Column(name = "DELETED")
  private boolean deleted;

  @Column(name = "CREATED_AT")
  private LocalDateTime createdAt;

  @Column(name = "EDITED_AT")
  private LocalDateTime editedAt;

  public enum ContentType {
    TEXT, IMAGE, FILE
  }

  // Default constructor
  public Message() {
    this.id = UUID.randomUUID();
  }

  // Getters and setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Long getChannelId() { return channelId; }
  public void setChannelId(Long channelId) { this.channelId = channelId; }

  public UUID getDirectConversationId() { return directConversationId; }
  public void setDirectConversationId(UUID directConversationId) { this.directConversationId = directConversationId; }

  public UUID getSenderUserId() { return senderUserId; }
  public void setSenderUserId(UUID senderUserId) { this.senderUserId = senderUserId; }

  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }

  public ContentType getContentType() { return contentType; }
  public void setContentType(ContentType contentType) { this.contentType = contentType; }

  public boolean isDeleted() { return deleted; }
  public void setDeleted(boolean deleted) { this.deleted = deleted; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getEditedAt() { return editedAt; }
  public void setEditedAt(LocalDateTime editedAt) { this.editedAt = editedAt; }
}