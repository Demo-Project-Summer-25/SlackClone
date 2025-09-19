package com.hire_me.Ping.calendar.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public class AttendeeCreateRequest {

    @NotNull
    private UUID userId;

    public AttendeeCreateRequest() { }

    public AttendeeCreateRequest(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}
