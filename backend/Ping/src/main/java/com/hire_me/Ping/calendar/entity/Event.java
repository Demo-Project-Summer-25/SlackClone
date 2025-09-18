package com.hire_me.Ping.calendar.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(
    name = "events",
    indexes = {
        @Index(name = "idx_events_calendar", columnList = "calendar_id"),
        @Index(name = "idx_events_time", columnList = "start_utc, end_utc")
    }
)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who created/owns this event (usually the calendar's owner)
    @Column(name = "organizer_id", nullable = false)
    private Long organizerId;

    // Belongs to exactly one Calendar
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "calendar_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_event_calendar"))
    private Calendar calendar;

    // Required basics
    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "start_utc", nullable = false)
    private Instant startUtc;

    @Column(name = "end_utc", nullable = false)
    private Instant endUtc;

    // Keep timezone for correct display/formatting (required, not optional)
    @Column(name = "timezone", nullable = false, length = 100)
    private String timezone; // e.g., "America/New_York"

    // --- Optional (only these two as requested) ---
    @Column(length = 4000)
    private String description;

    @Column(length = 255)
    private String location;

    // ---- Constructors ----
    public Event() {}

    public Event(Long organizerId, Calendar calendar, String title,
                 Instant startUtc, Instant endUtc, String timezone,
                 String description, String location) {
        this.organizerId = organizerId;
        this.calendar = calendar;
        this.title = title;
        this.startUtc = startUtc;
        this.endUtc = endUtc;
        this.timezone = timezone;
        this.description = description;
        this.location = location;
    }

    // ---- Getters/Setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public Calendar getCalendar() { return calendar; }
    public void setCalendar(Calendar calendar) { this.calendar = calendar; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Instant getStartUtc() { return startUtc; }
    public void setStartUtc(Instant startUtc) { this.startUtc = startUtc; }

    public Instant getEndUtc() { return endUtc; }
    public void setEndUtc(Instant endUtc) { this.endUtc = endUtc; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
