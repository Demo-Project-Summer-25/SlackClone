package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByColumnIdOrderByPositionAsc(Long columnId);

    List<Card> findByColumnBoardIdOrderByPositionAsc(Long boardId);

    Optional<Card> findByIdAndColumnBoardId(Long cardId, Long boardId);
}
