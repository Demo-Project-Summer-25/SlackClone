package com.hire_me.Ping.kanban.controller;

import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.dto.ColumnCreateRequest;
import com.hire_me.Ping.kanban.dto.ColumnUpdateRequest;
import com.hire_me.Ping.kanban.service.BoardColumnService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ColumnController {

    private final BoardColumnService columnService;

    public ColumnController(BoardColumnService columnService) {
        this.columnService = columnService;
    }

    @PostMapping("/boards/{boardId}/columns")
    public ResponseEntity<BoardResponse> createColumn(@PathVariable UUID boardId,
                                                      @Valid @RequestBody ColumnCreateRequest request) {
        request.setBoardId(boardId);
        return ResponseEntity.ok(columnService.create(request));
    }

    @PatchMapping("/columns/{columnId}")
    public ResponseEntity<BoardResponse> updateColumn(@PathVariable UUID columnId,
                                                      @Valid @RequestBody ColumnUpdateRequest request) {
        return ResponseEntity.ok(columnService.update(columnId, request));
    }

    @DeleteMapping("/columns/{columnId}")
    public ResponseEntity<BoardResponse> deleteColumn(@PathVariable UUID columnId) {
        return ResponseEntity.ok(columnService.delete(columnId));
    }
}
