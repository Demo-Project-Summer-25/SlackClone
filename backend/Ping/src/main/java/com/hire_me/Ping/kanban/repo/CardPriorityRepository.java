package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.CardPriority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CardPriorityRepository extends JpaRepository<CardPriority, UUID> {
    Optional<CardPriority> findByKey(String key);

    List<CardPriority> findAllByOrderBySortOrderAsc();
}
