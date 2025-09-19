package com.hire_me.Ping.kanban.service;

import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.dto.CardAssignmentRequest;
import com.hire_me.Ping.kanban.entity.Card;
import com.hire_me.Ping.kanban.entity.CardAssignment;
import com.hire_me.Ping.kanban.mapper.KanbanMapper;
import com.hire_me.Ping.kanban.repo.CardAssignmentRepository;
import com.hire_me.Ping.kanban.repo.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class CardAssignmentService {

    private final CardRepository cardRepository;
    private final CardAssignmentRepository assignmentRepository;
    private final KanbanBoardService boardService;
    private final KanbanMapper mapper;

    public CardAssignmentService(CardRepository cardRepository,
                                 CardAssignmentRepository assignmentRepository,
                                 KanbanBoardService boardService,
                                 KanbanMapper mapper) {
        this.cardRepository = cardRepository;
        this.assignmentRepository = assignmentRepository;
        this.boardService = boardService;
        this.mapper = mapper;
    }

    @Transactional
    public BoardResponse assign(UUID cardId, CardAssignmentRequest request) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + cardId));

        if (!assignmentRepository.existsByCard_IdAndAssigneeId(cardId, request.getUserId())) {
            CardAssignment assignment = mapper.toAssignment(request);
            card.addAssignment(assignment);
            cardRepository.save(card);
        }

        return boardService.get(card.getColumn().getBoard().getId());
    }

    @Transactional
    public BoardResponse unassign(UUID cardId, UUID userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + cardId));
        UUID boardId = card.getColumn().getBoard().getId();
        assignmentRepository.deleteByCard_IdAndAssigneeId(cardId, userId);
        return boardService.get(boardId);
    }
}
