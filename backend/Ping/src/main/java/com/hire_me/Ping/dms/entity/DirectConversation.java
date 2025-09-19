package com.hire_me.Ping.dms.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

// This class maps to the "direct_conversation" table.
@Entity
@Table(name = "direct_conversation")
public class DirectConversation {

  // Primary key (UUID).
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;  // Changed from Long to UUID

  // True = group DM (3+ people). False = 1:1 DM.
  @Column(name = "is_group")
  private boolean isGroup;

  @Column(name = "title")
  private String title;

  @Column(name = "created_by_user_id")
  private UUID createdByUserId;  // Added missing field

  // When this DM was created.
  @Column(name = "created_at")
  private Instant createdAt;

  // When this DM was last updated.
  @Column(name = "updated_at")
  private Instant updatedAt;

  // Automatically set createdAt and updatedAt before inserting a record.
  @PrePersist
  protected void onCreate() {
    createdAt = Instant.now();
    updatedAt = Instant.now();
  }

  // Automatically update updatedAt before updating a record.
  @PreUpdate
  protected void onUpdate() {
    updatedAt = Instant.now();
  }

  // Default constructor
  public DirectConversation() {
    this.id = UUID.randomUUID();
  }

  // --- getters/setters: small methods to read/write fields ---

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public boolean isGroup() { return isGroup; }
  public void setGroup(boolean group) { isGroup = group; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public UUID getCreatedByUserId() { return createdByUserId; }
  public void setCreatedByUserId(UUID createdByUserId) { this.createdByUserId = createdByUserId; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
