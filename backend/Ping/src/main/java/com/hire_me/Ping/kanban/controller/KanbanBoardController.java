package com.hire_me.Ping.kanban.controller;

import com.hire_me.Ping.kanban.dto.BoardCreateRequest;
import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.service.KanbanBoardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
public class KanbanBoardController {

    private final KanbanBoardService boardService;

    public KanbanBoardController(KanbanBoardService boardService) {
        this.boardService = boardService;
    }

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(@Valid @RequestBody BoardCreateRequest request) {
        BoardResponse response = boardService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long boardId) {
        return ResponseEntity.ok(boardService.get(boardId));
    }

    @GetMapping
    public ResponseEntity<List<BoardResponse>> listBoards(@RequestParam UUID ownerId) {
        return ResponseEntity.ok(boardService.listByOwner(ownerId));
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long boardId) {
        boardService.delete(boardId);
        return ResponseEntity.noContent().build();
    }
}
