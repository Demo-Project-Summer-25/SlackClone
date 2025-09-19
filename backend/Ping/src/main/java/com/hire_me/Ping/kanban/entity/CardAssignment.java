package com.hire_me.Ping.kanban.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "card_assignment", uniqueConstraints = {
    @UniqueConstraint(name = "uq_assignment", columnNames = {"card_id", "assignee_id"})
}, indexes = {
    @Index(name = "idx_assignment_card", columnList = "card_id"),
    @Index(name = "idx_assignment_user", columnList = "assignee_id")
})
public class CardAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "card_id", nullable = false, columnDefinition = "uuid")
    private Card card;

    @Column(name = "assignee_id", nullable = false, columnDefinition = "uuid")
    private UUID assigneeId;

    @Column(name = "assigned_at", nullable = false)
    private Instant assignedAt;

    @PrePersist
    void onCreate() {
        if (assignedAt == null) {
            assignedAt = Instant.now();
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public UUID getCardId() {
        return card != null ? card.getId() : null;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(UUID assigneeId) {
        this.assigneeId = assigneeId;
    }

    public Instant getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(Instant assignedAt) {
        this.assignedAt = assignedAt;
    }
}
