package com.hire_me.Ping.calendar.repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hire_me.Ping.calendar.entity.Event;

public interface EventRepository extends JpaRepository<Event, UUID> {

    @Query("""
        select e from Event e
        where e.calendar.id = :calendarId
          and e.startUtc < :windowEnd
          and e.endUtc   > :windowStart
    """)
    List<Event> findInWindowForCalendar(@Param("calendarId") UUID calendarId,
                                        @Param("windowStart") Instant windowStart,
                                        @Param("windowEnd") Instant windowEnd);

    Optional<Event> findByIdAndOrganizerId(UUID id, UUID organizerId);

    // Optional convenience:
    // List<Event> findByCalendar_Id(UUID calendarId);
}