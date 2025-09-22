package com.hire_me.Ping.kanban.service;

import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.dto.CardCreateRequest;
import com.hire_me.Ping.kanban.dto.CardUpdateRequest;
import com.hire_me.Ping.kanban.entity.BoardColumn;
import com.hire_me.Ping.kanban.entity.Card;
import com.hire_me.Ping.kanban.entity.CardPriority;
import com.hire_me.Ping.kanban.mapper.KanbanMapper;
import com.hire_me.Ping.kanban.repo.BoardColumnRepository;
import com.hire_me.Ping.kanban.repo.CardPriorityRepository;
import com.hire_me.Ping.kanban.repo.CardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class CardService {

    private final BoardColumnRepository columnRepository;
    private final CardRepository cardRepository;
    private final CardPriorityRepository priorityRepository;
    private final KanbanBoardService boardService;
    private final KanbanMapper mapper;

    public CardService(BoardColumnRepository columnRepository,
                       CardRepository cardRepository,
                       CardPriorityRepository priorityRepository,
                       KanbanBoardService boardService,
                       KanbanMapper mapper) {
        this.columnRepository = columnRepository;
        this.cardRepository = cardRepository;
        this.priorityRepository = priorityRepository;
        this.boardService = boardService;
        this.mapper = mapper;
    }

    @Transactional
    public BoardResponse create(CardCreateRequest request) {
        BoardColumn column = columnRepository.findById(request.getColumnId())
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + request.getColumnId()));

        Card card = mapper.toCard(request);
        card.setColumn(column);

        if (request.getPriorityId() != null) {
            CardPriority priority = priorityRepository.findById(request.getPriorityId())
                    .orElseThrow(() -> new NoSuchElementException("Priority not found: " + request.getPriorityId()));
            card.setPriority(priority);
        }

        if (card.getPosition() == null) {
            card.setPosition(nextCardPosition(column.getId()));
        }

        request.getAssignees().forEach(assignmentRequest -> card.addAssignment(mapper.toAssignment(assignmentRequest)));

        cardRepository.save(card);
        return boardService.get(column.getBoardId());
    }

    @Transactional
    public BoardResponse update(UUID cardId, CardUpdateRequest request) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + cardId));

        if (request.getColumnId() != null && !request.getColumnId().equals(card.getColumnId())) {
            BoardColumn newColumn = columnRepository.findById(request.getColumnId())
                    .orElseThrow(() -> new NoSuchElementException("Column not found: " + request.getColumnId()));
            card.setColumn(newColumn);
            if (request.getPosition() == null) {
                card.setPosition(nextCardPosition(newColumn.getId()));
            }
        }

        if (request.getPriorityId() != null) {
            CardPriority priority = priorityRepository.findById(request.getPriorityId())
                    .orElseThrow(() -> new NoSuchElementException("Priority not found: " + request.getPriorityId()));
            card.setPriority(priority);
        }

        mapper.updateCard(card, request);
        cardRepository.save(card);
        return boardService.get(card.getColumn().getBoard().getId());
    }

    @Transactional
    public BoardResponse delete(UUID cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("Card not found: " + cardId));
        UUID boardId = card.getColumn().getBoard().getId();
        cardRepository.delete(card);
        return boardService.get(boardId);
    }

    private int nextCardPosition(UUID columnId) {
        return cardRepository.findByColumn_IdOrderByPositionAsc(columnId).stream()
                .map(Card::getPosition)
                .filter(position -> position != null)
                .max(Comparator.naturalOrder())
                .map(max -> max + 1)
                .orElse(0);
    }
}
