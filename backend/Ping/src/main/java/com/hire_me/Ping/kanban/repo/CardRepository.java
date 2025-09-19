package com.hire_me.Ping.kanban.repo;

import com.hire_me.Ping.kanban.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CardRepository extends JpaRepository<Card, UUID> {
    List<Card> findByColumn_IdOrderByPositionAsc(UUID columnId);

    List<Card> findByColumn_Board_IdOrderByPositionAsc(UUID boardId);

    Optional<Card> findByIdAndColumn_Board_Id(UUID cardId, UUID boardId);
}
