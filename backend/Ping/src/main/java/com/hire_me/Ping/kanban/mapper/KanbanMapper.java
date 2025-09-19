package com.hire_me.Ping.kanban.mapper;

import com.hire_me.Ping.kanban.dto.*;
import com.hire_me.Ping.kanban.entity.*;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class KanbanMapper {

    public KanbanBoard toBoard(BoardCreateRequest req) {
        KanbanBoard board = new KanbanBoard();
        board.setName(req.getName());
        board.setDescription(req.getDescription());
        board.setOwnerId(req.getOwnerId());
        return board;
    }

    public BoardColumn toColumn(ColumnCreateRequest req) {
        BoardColumn column = new BoardColumn();
        column.setName(req.getName());
        if (req.getPosition() != null) {
            column.setPosition(req.getPosition());
        }
        return column;
    }

    public void updateColumn(BoardColumn column, ColumnUpdateRequest req) {
        if (req.getName() != null) {
            column.setName(req.getName());
        }
        if (req.getPosition() != null) {
            column.setPosition(req.getPosition());
        }
    }

    public Card toCard(CardCreateRequest req) {
        Card card = new Card();
        card.setTitle(req.getTitle());
        card.setDescription(req.getDescription());
        if (req.getPosition() != null) {
            card.setPosition(req.getPosition());
        }
        card.setDueAt(req.getDueAt());
        card.setCreatedBy(req.getCreatedBy());
        card.setArchived(false);
        return card;
    }

    public void updateCard(Card card, CardUpdateRequest req) {
        if (req.getTitle() != null) {
            card.setTitle(req.getTitle());
        }
        if (req.getDescription() != null) {
            card.setDescription(req.getDescription());
        }
        if (req.getDueAt() != null) {
            card.setDueAt(req.getDueAt());
        }
        if (req.getPosition() != null) {
            card.setPosition(req.getPosition());
        }
        if (req.getArchived() != null) {
            card.setArchived(req.getArchived());
        }
    }

    public CardAssignment toAssignment(CardAssignmentRequest req) {
        CardAssignment assignment = new CardAssignment();
        assignment.setAssigneeId(req.getUserId());
        return assignment;
    }

    public CardResponse toCardResponse(Card card) {
        CardResponse resp = new CardResponse();
        resp.setId(card.getId());
        resp.setColumnId(card.getColumnId());
        resp.setTitle(card.getTitle());
        resp.setDescription(card.getDescription());
        resp.setPosition(card.getPosition());
        resp.setDueAt(card.getDueAt());
        resp.setCreatedBy(card.getCreatedBy());
        resp.setArchived(card.isArchived());
        resp.setCreatedAt(card.getCreatedAt());
        resp.setUpdatedAt(card.getUpdatedAt());

        CardPriority priority = card.getPriority();
        if (priority != null) {
            resp.setPriorityId(priority.getId());
            resp.setPriorityLabel(priority.getLabel());
            resp.setPriorityColor(priority.getColorHex());
        }

        List<UUID> assignees = card.getAssignments().stream()
                .map(CardAssignment::getAssigneeId)
                .collect(Collectors.toList());
        resp.setAssignees(assignees);

        return resp;
    }

    public BoardResponse toBoardResponse(KanbanBoard board) {
        BoardResponse response = new BoardResponse();
        response.setId(board.getId());
        response.setName(board.getName());
        response.setDescription(board.getDescription());
        response.setOwnerId(board.getOwnerId());
        response.setCreatedAt(board.getCreatedAt());
        response.setUpdatedAt(board.getUpdatedAt());

        List<BoardResponse.Column> columnResponses = board.getColumns().stream()
                .sorted(Comparator.comparing(BoardColumn::getPosition, Comparator.nullsLast(Integer::compareTo))
                        .thenComparing(BoardColumn::getId, Comparator.nullsLast(UUID::compareTo)))
                .map(column -> {
                    BoardResponse.Column colDto = new BoardResponse.Column();
                    colDto.setId(column.getId());
                    colDto.setName(column.getName());
                    colDto.setPosition(column.getPosition());
                    colDto.setCreatedAt(column.getCreatedAt());
                    colDto.setUpdatedAt(column.getUpdatedAt());

                    List<CardResponse> cards = column.getCards().stream()
                            .sorted(Comparator.comparing(Card::getPosition, Comparator.nullsLast(Integer::compareTo))
                                    .thenComparing(Card::getId, Comparator.nullsLast(UUID::compareTo)))
                            .map(this::toCardResponse)
                            .collect(Collectors.toList());
                    colDto.setCards(cards);

                    return colDto;
                })
                .collect(Collectors.toList());

        response.setColumns(columnResponses);
        return response;
    }
}
