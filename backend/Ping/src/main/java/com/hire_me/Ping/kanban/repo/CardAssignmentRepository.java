package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.CardAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CardAssignmentRepository extends JpaRepository<CardAssignment, Long> {
    List<CardAssignment> findByCardId(Long cardId);

    boolean existsByCardIdAndAssigneeId(Long cardId, UUID assigneeId);

    void deleteByCardIdAndAssigneeId(Long cardId, UUID assigneeId);
}
