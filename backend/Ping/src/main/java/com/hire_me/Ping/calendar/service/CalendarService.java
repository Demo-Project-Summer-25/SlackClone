package com.hire_me.Ping.calendar.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.hire_me.Ping.calendar.dto.CalendarResponse;
import com.hire_me.Ping.calendar.dto.CreateOrGetMyCalendarResponse;
import com.hire_me.Ping.calendar.dto.EventCreateRequest;
import com.hire_me.Ping.calendar.dto.EventResponse;
import com.hire_me.Ping.calendar.dto.EventUpdateRequest;

public interface CalendarService {

    // Calendars
    CreateOrGetMyCalendarResponse createOrGetMyCalendar(UUID userId);
    CalendarResponse getMyCalendar(UUID userId);

    // Events
    EventResponse createEvent(UUID userId, EventCreateRequest req);
    List<EventResponse> listEvents(UUID userId, Instant from, Instant to);
    EventResponse getEvent(UUID userId, UUID eventId);
    EventResponse updateEvent(UUID userId, UUID eventId, EventUpdateRequest req);
    void deleteEvent(UUID userId, UUID eventId);

    // Attendees
    EventResponse addAttendee(UUID userId, UUID eventId, UUID attendeeUserId);
    void removeAttendee(UUID userId, UUID eventId, UUID attendeeUserId);
}
