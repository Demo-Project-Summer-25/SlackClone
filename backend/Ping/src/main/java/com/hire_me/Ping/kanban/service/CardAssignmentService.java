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
    public BoardResponse assign(Long cardId, CardAssignmentRequest request) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + cardId));

        if (!assignmentRepository.existsByCardIdAndAssigneeId(cardId, request.getUserId())) {
            CardAssignment assignment = mapper.toAssignment(request);
            card.addAssignment(assignment);
            cardRepository.save(card);
        }

        return boardService.get(card.getColumn().getBoardId());
    }

    @Transactional
    public BoardResponse unassign(Long cardId, UUID userId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + cardId));
        Long boardId = card.getColumn().getBoardId();
        assignmentRepository.deleteByCardIdAndAssigneeId(cardId, userId);
        return boardService.get(boardId);
    }
}
