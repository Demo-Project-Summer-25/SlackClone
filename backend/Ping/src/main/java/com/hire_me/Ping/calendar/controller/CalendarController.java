package com.hire_me.Ping.calendar.controller;

import com.hire_me.Ping.calendar.dto.*;
import com.hire_me.Ping.calendar.service.CalendarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CalendarController {

    private final CalendarService service;

    public CalendarController(CalendarService service) {
        this.service = service;
    }

    // --- Calendars ---

    @PostMapping("/calendars/me")
    public CreateOrGetMyCalendarResponse createOrGetMyCalendar(
            @RequestAttribute("userId") UUID userId) {
        return service.createOrGetMyCalendar(userId);
    }

    @GetMapping("/calendars/me")
    public CalendarResponse getMyCalendar(
            @RequestAttribute("userId") UUID userId) {
        return service.getMyCalendar(userId);
    }

    // --- Events ---

    @PostMapping("/calendar/events")
    public EventResponse createEvent(
            @RequestAttribute("userId") UUID userId,
            @Valid @RequestBody EventCreateRequest req) {
        return service.createEvent(userId, req);
    }

    // Spring can parse ISO-8601 instants like "2025-09-22T00:00:00Z"
    @GetMapping("/calendar/events")
    public List<EventResponse> listEvents(
            @RequestAttribute("userId") UUID userId,
            @RequestParam("from") Instant from,
            @RequestParam("to") Instant to) {
        return service.listEvents(userId, from, to);
    }

    @GetMapping("/calendar/events/{eventId}")
    public EventResponse getEvent(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID eventId) {
        return service.getEvent(userId, eventId);
    }

    @PatchMapping("/calendar/events/{eventId}")
    public EventResponse updateEvent(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID eventId,
            @Valid @RequestBody EventUpdateRequest req) {
        return service.updateEvent(userId, eventId, req);
    }

    @DeleteMapping("/calendar/events/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID eventId) {
        service.deleteEvent(userId, eventId);
    }

    // --- Attendees ---

    @PostMapping("/calendar/events/{eventId}/attendees")
    public EventResponse addAttendee(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID eventId,
            @Valid @RequestBody AttendeeCreateRequest req) {
        return service.addAttendee(userId, eventId, req.getUserId());
    }

    // Using attendee userId in the path for removal
    @DeleteMapping("/calendar/events/{eventId}/attendees/{userIdToRemove}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeAttendee(
            @RequestAttribute("userId") UUID userId,
            @PathVariable UUID eventId,
            @PathVariable("userIdToRemove") UUID userIdToRemove) {
        service.removeAttendee(userId, eventId, userIdToRemove);
    }
}
