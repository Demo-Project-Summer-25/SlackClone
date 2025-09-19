package com.hire_me.Ping.calendar.dto;
import java.util.UUID;

/**
 * Read-only shape returned to clients for event views & lists.
 * Times are ISO-8601 strings with timezone offsets.
 */
public class EventResponse {

    private UUID id;
    private UUID calendarId;
    private UUID organizerId;

    private String title;
    private String startsAt;   // ISO-8601 with zone, e.g., "2025-09-22T19:00:00-04:00"
    private String endsAt;     // ISO-8601 with zone
    private String timezone;   // e.g., "America/New_York"

    private String description; // optional
    private String location;    // optional
    private String visibility;  // "PRIVATE" | "PUBLIC" | "CHANNEL"

    public EventResponse() {}

    public EventResponse(UUID id,
                         UUID calendarId,
                         UUID organizerId,
                         String title,
                         String startsAt,
                         String endsAt,
                         String timezone,
                         String description,
                         String location,
                         String visibility) {
        this.id = id;
        this.calendarId = calendarId;
        this.organizerId = organizerId;
        this.title = title;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.timezone = timezone;
        this.description = description;
        this.location = location;
        this.visibility = visibility;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCalendarId() { return calendarId; }
    public void setCalendarId(UUID calendarId) { this.calendarId = calendarId; }

    public UUID getOrganizerId() { return organizerId; }
    public void setOrganizerId(UUID organizerId) { this.organizerId = organizerId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStartsAt() { return startsAt; }
    public void setStartsAt(String startsAt) { this.startsAt = startsAt; }

    public String getEndsAt() { return endsAt; }
    public void setEndsAt(String endsAt) { this.endsAt = endsAt; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
}

