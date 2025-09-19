package com.hire_me.Ping.calendar.repository;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hire_me.Ping.calendar.entity.Calendar;

public interface CalendarRepository extends JpaRepository<Calendar, UUID> {
    Optional<Calendar> findByOwnerId(UUID ownerId);

}
