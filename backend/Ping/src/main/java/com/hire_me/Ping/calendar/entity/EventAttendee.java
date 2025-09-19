package com.hire_me.Ping.calendar.entity;

import java.util.UUID;

import com.hire_me.Ping.calendar.model.AttendeeStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "event_attendees",
    uniqueConstraints = @UniqueConstraint(name = "uk_event_user", columnNames = {"event_id", "user_id"})
)
public class EventAttendee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Link to the event (required)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_attendee_event"))
    private Event event;

    // The invited user (store userId for simplicity)
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    // RSVP status (INVITED/GOING/MAYBE/DECLINED)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AttendeeStatus status = AttendeeStatus.INVITED;

    // ---- Constructors ----
    public EventAttendee() {}

    public EventAttendee(Event event, UUID userId, AttendeeStatus status) {
        this.event = event;
        this.userId = userId;
        this.status = status;
    }

    // ---- Getters/Setters ----
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public AttendeeStatus getStatus() { return status; }
    public void setStatus(AttendeeStatus status) { this.status = status; }
}
