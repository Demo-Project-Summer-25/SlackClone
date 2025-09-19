package com.hire_me.Ping.kanban.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CardCreateRequest {

    @NotNull
    private UUID columnId;

    @NotBlank
    @Size(max = 200)
    private String title;

    private String description;

    @Min(0)
    private Integer position;

    private Instant dueAt;

    private UUID priorityId;

    @NotNull
    private UUID createdBy;

    @Valid
    private List<CardAssignmentRequest> assignees = new ArrayList<>();

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
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

    public UUID getPriorityId() {
        return priorityId;
    }

    public void setPriorityId(UUID priorityId) {
        this.priorityId = priorityId;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public List<CardAssignmentRequest> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<CardAssignmentRequest> assignees) {
        this.assignees = assignees;
    }
}
