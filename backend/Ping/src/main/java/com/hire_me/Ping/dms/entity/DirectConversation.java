package com.hire_me.Ping.dms.entity;

import jakarta.persistence.*;               // JPA annotations like @Entity
import java.time.Instant;                   // time type
import java.util.ArrayList;
import java.util.List;

// This class maps to the "direct_conversation" table.
@Entity
@Table(name = "direct_conversation")
public class DirectConversation {
    // Primary key (auto number).
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who created this DM (user id).
    @Column(name = "created_by_user_id", nullable = false)
    private Long createdByUserId;

    // True = group DM (3+ people). False = 1:1 DM.
    @Column(name = "is_group", nullable = false)
    private boolean isGroup = false;

    // Optional name for the DM (mainly for groups).
    @Column(length = 140)
    private String title;

    // When this DM was created.
    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    // Participants (read-only association helper). Maintains backrefs from DirectParticipant.conversation
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DirectParticipant> participants = new ArrayList<>();

    // --- getters/setters: small methods to read/write fields ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }

    public boolean isGroup() { return isGroup; }
    public void setGroup(boolean group) { isGroup = group; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<DirectParticipant> getParticipants() { return participants; }
    public void setParticipants(List<DirectParticipant> participants) { this.participants = participants; }
}
