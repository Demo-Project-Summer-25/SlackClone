package com.hire_me.Ping.calendar.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hire_me.Ping.calendar.entity.EventAttendee;

public interface EventAttendeeRepository extends JpaRepository<EventAttendee, UUID> {

    // Check if a user is already an attendee of an event
    Optional<EventAttendee> findByEvent_IdAndUserId(UUID eventId, UUID userId);

    // List all attendees for an event
    List<EventAttendee> findByEvent_Id(UUID eventId);

    // Remove a specific user from an event
    void deleteByEvent_IdAndUserId(UUID eventId, UUID userId);
}

