package com.hire_me.Ping.calendar.mapper;

import org.springframework.stereotype.Component;

import com.hire_me.Ping.calendar.dto.CalendarResponse;
import com.hire_me.Ping.calendar.entity.Calendar;

@Component
public class CalendarMapper {

    public CalendarResponse toResponse(Calendar c) {
        if (c == null) return null;
        return new CalendarResponse(
                c.getId(),
                c.getOwnerId(),
                c.getDefaultTimezone(),
                c.getDefaultReminderMinutes()
        );
    }
}
