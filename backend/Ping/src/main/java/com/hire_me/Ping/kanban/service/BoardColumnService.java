package com.hire_me.Ping.kanban.service;
//BoardColumnService.java
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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import com.hire_me.Ping.kanban.ws.KanbanEvents;
@Service
public class BoardColumnService {
    private final KanbanBoardRepository boardRepository;
    private final BoardColumnRepository columnRepository;
    private final KanbanBoardService boardService;
    private final KanbanMapper mapper;
    private final KanbanEvents events;
    @PersistenceContext
    private EntityManager em;
    public BoardColumnService(KanbanBoardRepository boardRepository,
                              BoardColumnRepository columnRepository,
                              KanbanBoardService boardService,
                              KanbanMapper mapper,
                              KanbanEvents events) {
        this.boardRepository = boardRepository;
        this.columnRepository = columnRepository;
        this.boardService = boardService;
        this.mapper = mapper;
        this.events = events;
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
        em.flush();
        em.clear();
        BoardResponse resp = boardService.get(board.getId());
        events.toBoard(board.getId(), KanbanEvents.EventType.updated, resp);
        return resp;
    }
    @Transactional
    public BoardResponse update(UUID columnId, ColumnUpdateRequest request) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + columnId));
        mapper.updateColumn(column, request);
        columnRepository.save(column);
        em.flush();
        em.clear();
        UUID boardId = column.getBoardId();
        BoardResponse resp = boardService.get(boardId);
        events.toBoard(boardId, KanbanEvents.EventType.updated, resp);
        return resp;
    }
    @Transactional
    public BoardResponse delete(UUID columnId) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new NoSuchElementException("Column not found: " + columnId));
        UUID boardId = column.getBoardId();
        columnRepository.delete(column);
        em.flush();
        em.clear();
        BoardResponse resp = boardService.get(boardId);
        events.toBoard(boardId, KanbanEvents.EventType.updated, resp);
        return resp;
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