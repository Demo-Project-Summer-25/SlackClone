package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BoardColumnRepository extends JpaRepository<BoardColumn, UUID> {
    List<BoardColumn> findByBoard_IdOrderByPositionAsc(UUID boardId);

    Optional<BoardColumn> findByIdAndBoard_Id(UUID id, UUID boardId);
}
