package com.hire_me.Ping.kanban.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CardAssignmentRequest {

    @NotNull
    private UUID userId;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
