package com.hire_me.Ping.kanban.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "card", indexes = {
    @Index(name = "idx_card_column", columnList = "column_id"),
    @Index(name = "idx_card_position", columnList = "column_id, position_order")
})
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "column_id", nullable = false, columnDefinition = "uuid")
    private BoardColumn column;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "priority_id", columnDefinition = "uuid")
    private CardPriority priority;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column
    private String description;

    @Column(name = "position_order", nullable = false)
    private Integer position = 0;

    @Column(name = "due_at")
    private Instant dueAt;

    @Column(name = "created_by", nullable = false, columnDefinition = "uuid")
    private UUID createdBy;

    @Column(name = "archived", nullable = false)
    private boolean archived = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CardAssignment> assignments = new ArrayList<>();

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BoardColumn getColumn() {
        return column;
    }

    public void setColumn(BoardColumn column) {
        this.column = column;
    }

    public UUID getColumnId() {
        return column != null ? column.getId() : null;
    }

    public CardPriority getPriority() {
        return priority;
    }

    public void setPriority(CardPriority priority) {
        this.priority = priority;
    }

    public UUID getPriorityId() {
        return priority != null ? priority.getId() : null;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Instant getDueAt() {
        return dueAt;
    }

    public void setDueAt(Instant dueAt) {
        this.dueAt = dueAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<CardAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<CardAssignment> assignments) {
        this.assignments = assignments;
    }

    public void addAssignment(CardAssignment assignment) {
        assignments.add(assignment);
        assignment.setCard(this);
    }

    public void removeAssignment(CardAssignment assignment) {
        assignments.remove(assignment);
        assignment.setCard(null);
    }
}
