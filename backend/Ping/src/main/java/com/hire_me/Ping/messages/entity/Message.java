package com.hire_me.Ping.messages.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
  name = "message",
  indexes = {
    @Index(name = "idx_msg_channel_created", columnList = "channel_id, created_at"),
    @Index(name = "idx_msg_dm_created", columnList = "direct_conversation_id, created_at")
  }
)
public class Message {

  public enum ContentType { TEXT, MARKDOWN, CODE }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "channel_id")
  private Long channelId; // nullable for DMs

  @Column(name = "direct_conversation_id")
  private Long directConversationId; // nullable for channel messages

  @Column(name = "sender_user_id", nullable = false)
  private Long senderUserId;

  @Lob
  @Column(nullable = false)
  private String content;

  @Enumerated(EnumType.STRING)
  @Column(name = "content_type", nullable = false, length = 16)
  private ContentType contentType = ContentType.TEXT;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "edited_at")
  private Instant editedAt;

  @Column(name = "deleted", nullable = false)
  private boolean deleted = false;

  public Message() {}

  @PrePersist
  void onCreate() {
    if (createdAt == null) createdAt = Instant.now();
    if (contentType == null) contentType = ContentType.TEXT;
  }

  // ---- getters/setters ----
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getChannelId() { return channelId; }
  public void setChannelId(Long channelId) { this.channelId = channelId; }

  public Long getDirectConversationId() { return directConversationId; }
  public void setDirectConversationId(Long directConversationId) { this.directConversationId = directConversationId; }

  public Long getSenderUserId() { return senderUserId; }
  public void setSenderUserId(Long senderUserId) { this.senderUserId = senderUserId; }

  public String getContent() { return content; }
  public void setContent(String content) { this.content = content; }

  public ContentType getContentType() { return contentType; }
  public void setContentType(ContentType contentType) { this.contentType = contentType; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getEditedAt() { return editedAt; }
  public void setEditedAt(Instant editedAt) { this.editedAt = editedAt; }

  public boolean isDeleted() { return deleted; }
  public void setDeleted(boolean deleted) { this.deleted = deleted; }
}
