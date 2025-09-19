package com.hire_me.Ping.calendar.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EventCreateRequest {

    @NotBlank
    private String title;

    @NotNull
    private String startsAt; // ISO-8601 string with timezone

    @NotNull
    private String endsAt;   // ISO-8601 string with timezone

    private String description; // optional
    private String location;    // optional
    private String visibility;  // optional, defaults to "PRIVATE"

    public EventCreateRequest() { }

    public EventCreateRequest(String title, String startsAt, String endsAt,
                              String description, String location, String visibility) {
        this.title = title;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.description = description;
        this.location = location;
        this.visibility = visibility;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStartsAt() { return startsAt; }
    public void setStartsAt(String startsAt) { this.startsAt = startsAt; }

    public String getEndsAt() { return endsAt; }
    public void setEndsAt(String endsAt) { this.endsAt = endsAt; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
}
