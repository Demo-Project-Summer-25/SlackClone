package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.CardAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CardAssignmentRepository extends JpaRepository<CardAssignment, UUID> {
    List<CardAssignment> findByCard_Id(UUID cardId);

    boolean existsByCard_IdAndAssigneeId(UUID cardId, UUID assigneeId);

    void deleteByCard_IdAndAssigneeId(UUID cardId, UUID assigneeId);
}
