package com.hire_me.Ping.kanban.service;

import com.hire_me.Ping.kanban.dto.BoardCreateRequest;
import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.entity.KanbanBoard;
import com.hire_me.Ping.kanban.mapper.KanbanMapper;
import com.hire_me.Ping.kanban.repo.KanbanBoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KanbanBoardService {

    private final KanbanBoardRepository boardRepository;
    private final KanbanMapper mapper;

    public KanbanBoardService(KanbanBoardRepository boardRepository, KanbanMapper mapper) {
        this.boardRepository = boardRepository;
        this.mapper = mapper;
    }

    @Transactional
    public BoardResponse create(BoardCreateRequest request) {
        KanbanBoard board = mapper.toBoard(request);
        KanbanBoard saved = boardRepository.save(board);
        return get(saved.getId());
    }

    @Transactional(readOnly = true)
    public BoardResponse get(UUID boardId) {
        KanbanBoard board = boardRepository.findWithDetailsById(boardId)
                .orElseThrow(() -> new NoSuchElementException("Board not found: " + boardId));
        return mapper.toBoardResponse(board);
    }

    @Transactional(readOnly = true)
    public List<BoardResponse> listByOwner(UUID ownerId) {
        return boardRepository.findByOwnerIdOrderByCreatedAtAsc(ownerId).stream()
                .map(board -> boardRepository.findWithDetailsById(board.getId()).orElse(board))
                .map(mapper::toBoardResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(UUID boardId) {
        if (!boardRepository.existsById(boardId)) {
            throw new NoSuchElementException("Board not found: " + boardId);
        }
        boardRepository.deleteById(boardId);
    }
}
