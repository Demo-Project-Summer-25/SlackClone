package com.hire_me.Ping.dms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

// This class maps to the "direct_conversation" table.
@Entity
@Table(name = "DIRECT_CONVERSATION")
public class DirectConversation {

  // Primary key (auto number).
  @Id
  @Column(name = "ID")
  private UUID id;

  // Who created this DM (user id).
  @Column(name = "CREATED_BY_USER_ID")
  private UUID createdByUserId; // Keep as UUID since User entity uses UUID

  // Optional name for the DM (mainly for groups).
  @Column(name = "TITLE")
  private String title;

  // True = group DM (3+ people). False = 1:1 DM.
  @Column(name = "IS_GROUP")
  private boolean isGroup;

  // When this DM was created.
  @Column(name = "CREATED_AT")
  private LocalDateTime createdAt;

  // Default constructor
  public DirectConversation() {
    this.id = UUID.randomUUID();
  }

  // --- getters/setters: small methods to read/write fields ---

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public UUID getCreatedByUserId() { return createdByUserId; }
  public void setCreatedByUserId(UUID createdByUserId) { this.createdByUserId = createdByUserId; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public boolean isGroup() { return isGroup; }
  public void setGroup(boolean group) { isGroup = group; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
