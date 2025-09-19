package com.hire_me.Ping.calendar.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hire_me.Ping.calendar.dto.CalendarResponse;
import com.hire_me.Ping.calendar.dto.CreateOrGetMyCalendarResponse;
import com.hire_me.Ping.calendar.dto.EventCreateRequest;
import com.hire_me.Ping.calendar.dto.EventResponse;
import com.hire_me.Ping.calendar.dto.EventUpdateRequest;
import com.hire_me.Ping.calendar.entity.Calendar;
import com.hire_me.Ping.calendar.entity.Event;
import com.hire_me.Ping.calendar.entity.EventAttendee;
import com.hire_me.Ping.calendar.model.AttendeeStatus;
import com.hire_me.Ping.calendar.model.EventVisibility;
import com.hire_me.Ping.calendar.repository.CalendarRepository;
import com.hire_me.Ping.calendar.repository.EventAttendeeRepository;
import com.hire_me.Ping.calendar.repository.EventRepository;

@Service
public class CalendarServiceImpl implements CalendarService {

    private final CalendarRepository calendarRepo;
    private final EventRepository eventRepo;
    private final EventAttendeeRepository attendeeRepo;

    public CalendarServiceImpl(CalendarRepository calendarRepo,
                               EventRepository eventRepo,
                               EventAttendeeRepository attendeeRepo) {
        this.calendarRepo = calendarRepo;
        this.eventRepo = eventRepo;
        this.attendeeRepo = attendeeRepo;
    }

    // ----------------- Calendars -----------------

    @Transactional
    @Override
    public CreateOrGetMyCalendarResponse createOrGetMyCalendar(UUID userId) {
        Calendar cal = calendarRepo.findByOwnerId(userId).orElseGet(() -> {
            Calendar c = new Calendar();
            c.setOwnerId(userId);
            c.setDefaultTimezone("America/New_York"); // sensible default; change if you store user tz
            return calendarRepo.save(c);
        });
        return new CreateOrGetMyCalendarResponse(cal.getId());
    }

    @Transactional(readOnly = true)
    @Override
    public CalendarResponse getMyCalendar(UUID userId) {
        Calendar cal = calendarRepo.findByOwnerId(userId)
                .orElseThrow(() -> notFound("Calendar for user"));
        return new CalendarResponse(
                cal.getId(),
                cal.getOwnerId(),
                cal.getDefaultTimezone(),
                cal.getDefaultReminderMinutes()
        );
    }

    // ----------------- Events -----------------

    @Transactional
    @Override
    public EventResponse createEvent(UUID userId, EventCreateRequest req) {
        Calendar cal = calendarRepo.findByOwnerId(userId)
                .orElseThrow(() -> forbidden("Create your calendar first"));

        // parse + validate times
        ZonedDateTime startZ = parseZoned(req.getStartsAt(), "startsAt");
        ZonedDateTime endZ   = parseZoned(req.getEndsAt(), "endsAt");
        if (!endZ.isAfter(startZ)) throw bad("endsAt must be after startsAt");

        // build entity
        Event e = new Event();
        e.setOrganizerId(userId);
        e.setCalendar(cal);
        e.setTitle(Objects.requireNonNullElse(req.getTitle(), "").trim());
        if (e.getTitle().isEmpty()) throw bad("title is required");

        e.setStartUtc(startZ.toInstant());
        e.setEndUtc(endZ.toInstant());
        e.setTimezone(startZ.getZone().getId());

        e.setDescription(req.getDescription());
        e.setLocation(req.getLocation());

        // visibility (default PRIVATE)
        EventVisibility vis = parseVisibilityOrDefault(req.getVisibility(), EventVisibility.PRIVATE);
        e.setVisibility(vis);

        e = eventRepo.save(e);
        return toEventResponse(e);
    }

    @Transactional(readOnly = true)
    @Override
    public List<EventResponse> listEvents(UUID userId, Instant from, Instant to) {
        Calendar cal = calendarRepo.findByOwnerId(userId)
                .orElseThrow(() -> forbidden("Create your calendar first"));

        List<Event> events = eventRepo.findInWindowForCalendar(cal.getId(), from, to);
        return events.stream().map(this::toEventResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public EventResponse getEvent(UUID userId, UUID eventId) {
        Event e = eventRepo.findByIdAndOrganizerId(eventId, userId)
                .orElseThrow(() -> notFound("Event"));
        return toEventResponse(e);
    }

    @Transactional
    @Override
    public EventResponse updateEvent(UUID userId, UUID eventId, EventUpdateRequest req) {
        Event e = eventRepo.findByIdAndOrganizerId(eventId, userId)
                .orElseThrow(() -> notFound("Event"));

        if (req.getTitle() != null) {
            String t = req.getTitle().trim();
            if (t.isEmpty()) throw bad("title cannot be blank");
            e.setTitle(t);
        }
        if (req.getDescription() != null) e.setDescription(req.getDescription());
        if (req.getLocation() != null) e.setLocation(req.getLocation());

        // apply time changes (ensure proper ordering)
        if (req.getStartsAt() != null) {
            ZonedDateTime s = parseZoned(req.getStartsAt(), "startsAt");
            e.setStartUtc(s.toInstant());
            e.setTimezone(s.getZone().getId()); // keep latest tz if start changed
        }
        if (req.getEndsAt() != null) {
            ZonedDateTime en = parseZoned(req.getEndsAt(), "endsAt");
            e.setEndUtc(en.toInstant());
        }
        if (!e.getEndUtc().isAfter(e.getStartUtc())) throw bad("endsAt must be after startsAt");

        if (req.getVisibility() != null) {
            e.setVisibility(parseVisibilityOrDefault(req.getVisibility(), e.getVisibility()));
        }

        return toEventResponse(e);
    }

    @Transactional
    @Override
    public void deleteEvent(UUID userId, UUID eventId) {
        Event e = eventRepo.findByIdAndOrganizerId(eventId, userId)
                .orElseThrow(() -> notFound("Event"));
        eventRepo.delete(e); // or soft delete if you add a 'canceled' flag
    }

    // ----------------- Attendees -----------------

    @Transactional
    @Override
    public EventResponse addAttendee(UUID userId, UUID eventId, UUID attendeeUserId) {
        Event e = eventRepo.findByIdAndOrganizerId(eventId, userId)
                .orElseThrow(() -> notFound("Event"));

        attendeeRepo.findByEvent_IdAndUserId(eventId, attendeeUserId)
                .ifPresent(a -> { throw bad("User already invited"); });

        EventAttendee a = new EventAttendee();
        a.setEvent(e);
        a.setUserId(attendeeUserId);
        a.setStatus(AttendeeStatus.INVITED);
        attendeeRepo.save(a);

        return toEventResponse(e);
    }

    @Transactional
    @Override
    public void removeAttendee(UUID userId, UUID eventId, UUID attendeeUserId) {
        // ensure caller owns the event
        Event e = eventRepo.findByIdAndOrganizerId(eventId, userId)
                .orElseThrow(() -> notFound("Event"));

        attendeeRepo.deleteByEvent_IdAndUserId(eventId, attendeeUserId);
    }

    // ----------------- Helpers -----------------

    private ZonedDateTime parseZoned(String iso, String field) {
        try {
            // Expecting strings like "2025-09-22T19:00:00-04:00" (with zone/offset)
            return ZonedDateTime.parse(iso);
        } catch (Exception ex) {
            throw bad("Invalid " + field + " format. Expect ISO-8601 with timezone, e.g., 2025-09-22T19:00:00-04:00");
        }
    }

    private EventVisibility parseVisibilityOrDefault(String raw, EventVisibility dflt) {
        if (raw == null || raw.isBlank()) return dflt;
        try {
            return EventVisibility.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw bad("visibility must be one of PRIVATE, PUBLIC, CHANNEL");
        }
    }

    private EventResponse toEventResponse(Event e) {
        // Format start/end using the event's stored timezone
        String tz = e.getTimezone() != null ? e.getTimezone() : ZoneOffset.UTC.getId();
        ZoneId zone = ZoneId.of(tz);

        String startsAt = ZonedDateTime.ofInstant(e.getStartUtc(), zone).toOffsetDateTime().toString();
        String endsAt   = ZonedDateTime.ofInstant(e.getEndUtc(),   zone).toOffsetDateTime().toString();

        return new EventResponse(
                e.getId(),
                e.getCalendar().getId(),
                e.getOrganizerId(),
                e.getTitle(),
                startsAt,
                endsAt,
                tz,
                e.getDescription(),
                e.getLocation(),
                e.getVisibility().name()
        );
    }

    // Simple exception helpers; swap for your own exception classes/handlers
    private RuntimeException notFound(String what) { return new NoSuchElementException(what + " not found"); }
    private RuntimeException bad(String msg)       { return new IllegalArgumentException(msg); }
    private RuntimeException forbidden(String msg) { return new SecurityException(msg); }
}

