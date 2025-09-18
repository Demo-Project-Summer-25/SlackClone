package com.hire_me.Ping.calendar.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "calendars",
    uniqueConstraints = @UniqueConstraint(name = "uk_cal_owner", columnNames = "owner_id")
)
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One calendar per user — store the owner's userId for now
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(name = "default_timezone", length = 100)
    private String defaultTimezone;           // e.g., "America/New_York"

    @Column(name = "default_reminder_minutes")
    private Integer defaultReminderMinutes;   // e.g., 30 (minutes before start)

    // ---- Constructors ----
    public Calendar() {}

    public Calendar(Long ownerId, String defaultTimezone, Integer defaultReminderMinutes) {
        this.ownerId = ownerId;
        this.defaultTimezone = defaultTimezone;
        this.defaultReminderMinutes = defaultReminderMinutes;
    }

    // ---- Getters/Setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getDefaultTimezone() { return defaultTimezone; }
    public void setDefaultTimezone(String defaultTimezone) { this.defaultTimezone = defaultTimezone; }

    public Integer getDefaultReminderMinutes() { return defaultReminderMinutes; }
    public void setDefaultReminderMinutes(Integer defaultReminderMinutes) {
        this.defaultReminderMinutes = defaultReminderMinutes;
    }
}
