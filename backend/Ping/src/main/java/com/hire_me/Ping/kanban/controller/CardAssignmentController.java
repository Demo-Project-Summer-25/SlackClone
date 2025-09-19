package com.hire_me.Ping.kanban.controller;

import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.dto.CardAssignmentRequest;
import com.hire_me.Ping.kanban.service.CardAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CardAssignmentController {

    private final CardAssignmentService assignmentService;

    public CardAssignmentController(CardAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/cards/{cardId}/assignments")
    public ResponseEntity<BoardResponse> assign(@PathVariable Long cardId,
                                                @Valid @RequestBody CardAssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.assign(cardId, request));
    }

    @DeleteMapping("/cards/{cardId}/assignments/{userId}")
    public ResponseEntity<BoardResponse> unassign(@PathVariable Long cardId,
                                                  @PathVariable UUID userId) {
        return ResponseEntity.ok(assignmentService.unassign(cardId, userId));
    }
}
