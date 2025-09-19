package com.hire_me.Ping.calendar.mapper;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import org.springframework.stereotype.Component;

import com.hire_me.Ping.calendar.dto.EventResponse;
import com.hire_me.Ping.calendar.entity.Event;

@Component
public class EventMapper {

    public EventResponse toResponse(Event e) {
        if (e == null) return null;

        // Default to UTC if no timezone stored
        String tz = (e.getTimezone() != null) ? e.getTimezone() : ZoneOffset.UTC.getId();
        ZoneId zone = ZoneId.of(tz);

        // Format start & end
        String startsAt = e.getStartUtc() != null
                ? ZonedDateTime.ofInstant(e.getStartUtc(), zone).toOffsetDateTime().toString()
                : null;

        String endsAt = e.getEndUtc() != null
                ? ZonedDateTime.ofInstant(e.getEndUtc(), zone).toOffsetDateTime().toString()
                : null;

        return new EventResponse(
                e.getId(),
                e.getCalendar() != null ? e.getCalendar().getId() : null,
                e.getOrganizerId(),
                e.getTitle(),
                startsAt,
                endsAt,
                tz,
                e.getDescription(),
                e.getLocation(),
                e.getVisibility() != null ? e.getVisibility().name() : null
        );
    }
}
