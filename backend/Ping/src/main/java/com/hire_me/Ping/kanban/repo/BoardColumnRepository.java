package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.BoardColumn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardColumnRepository extends JpaRepository<BoardColumn, Long> {
    List<BoardColumn> findByBoardIdOrderByPositionAsc(Long boardId);

    Optional<BoardColumn> findByIdAndBoardId(Long id, Long boardId);
}
