package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.KanbanBoard;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KanbanBoardRepository extends JpaRepository<KanbanBoard, UUID> {

    List<KanbanBoard> findByOwnerIdOrderByCreatedAtAsc(UUID ownerId);

    @EntityGraph(attributePaths = {
            "columns",
            "columns.cards",
            "columns.cards.priority",
            "columns.cards.assignments"
    })
    Optional<KanbanBoard> findById(UUID id);
}
