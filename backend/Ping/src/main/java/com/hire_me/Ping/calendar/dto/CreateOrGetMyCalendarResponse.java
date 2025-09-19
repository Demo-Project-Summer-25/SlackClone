package com.hire_me.Ping.calendar.dto;

import java.util.UUID;

public class CreateOrGetMyCalendarResponse {

    private UUID id;

    public CreateOrGetMyCalendarResponse() { }

    public CreateOrGetMyCalendarResponse(UUID id) {
        this.id = id;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
}
