package com.hire_me.Ping.calendar.dto;
import java.util.UUID;

public class CalendarResponse {

    private UUID id;
    private UUID ownerId;
    private String defaultTimezone;
    private Integer defaultReminderMinutes;

    public CalendarResponse() { }

    public CalendarResponse(UUID id, UUID ownerId,
                            String defaultTimezone,
                            Integer defaultReminderMinutes) {
        this.id = id;
        this.ownerId = ownerId;
        this.defaultTimezone = defaultTimezone;
        this.defaultReminderMinutes = defaultReminderMinutes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }

    public String getDefaultTimezone() { return defaultTimezone; }
    public void setDefaultTimezone(String defaultTimezone) { this.defaultTimezone = defaultTimezone; }

    public Integer getDefaultReminderMinutes() { return defaultReminderMinutes; }
    public void setDefaultReminderMinutes(Integer defaultReminderMinutes) {
        this.defaultReminderMinutes = defaultReminderMinutes;
    }
}
