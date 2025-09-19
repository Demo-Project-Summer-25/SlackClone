package com.hire_me.Ping.kanban.service;

import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.dto.ColumnCreateRequest;
import com.hire_me.Ping.kanban.dto.ColumnUpdateRequest;
import com.hire_me.Ping.kanban.entity.BoardColumn;
import com.hire_me.Ping.kanban.entity.KanbanBoard;
import com.hire_me.Ping.kanban.mapper.KanbanMapper;
import com.hire_me.Ping.kanban.repo.BoardColumnRepository;
import com.hire_me.Ping.kanban.repo.KanbanBoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class BoardColumnService {

    private final KanbanBoardRepository boardRepository;
    private final BoardColumnRepository columnRepository;
    private final KanbanBoardService boardService;
    private final KanbanMapper mapper;

    public BoardColumnService(KanbanBoardRepository boardRepository,
                              BoardColumnRepository columnRepository,
                              KanbanBoardService boardService,
                              KanbanMapper mapper) {
        this.boardRepository = boardRepository;
        this.columnRepository = columnRepository;
        this.boardService = boardService;
        this.mapper = mapper;
    }

    @Transactional
    public BoardResponse create(ColumnCreateRequest request) {
        KanbanBoard board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new NoSuchElementException("Board not found: " + request.getBoardId()));

        BoardColumn column = mapper.toColumn(request);
        column.setBoard(board);
        if (column.getPosition() == null) {
            column.setPosition(nextColumnPosition(board.getId()));
        }

        columnRepository.save(column);
        return boardService.get(board.getId());
    }

    @Transactional
    public BoardResponse update(UUID columnId, ColumnUpdateRequest request) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + columnId));

        mapper.updateColumn(column, request);
        columnRepository.save(column);
        return boardService.get(column.getBoardId());
    }

    @Transactional
    public BoardResponse delete(UUID columnId) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + columnId));
        UUID boardId = column.getBoardId();
        columnRepository.delete(column);
        return boardService.get(boardId);
    }

    private int nextColumnPosition(UUID boardId) {
        return columnRepository.findByBoard_IdOrderByPositionAsc(boardId).stream()
                .map(BoardColumn::getPosition)
                .filter(position -> position != null)
                .max(Comparator.naturalOrder())
                .map(max -> max + 1)
                .orElse(0);
    }
}
