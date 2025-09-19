package com.hire_me.Ping.kanban.controller;

import com.hire_me.Ping.kanban.dto.BoardResponse;
import com.hire_me.Ping.kanban.dto.CardCreateRequest;
import com.hire_me.Ping.kanban.dto.CardUpdateRequest;
import com.hire_me.Ping.kanban.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping("/columns/{columnId}/cards")
    public ResponseEntity<BoardResponse> createCard(@PathVariable UUID columnId,
                                                    @Valid @RequestBody CardCreateRequest request) {
        request.setColumnId(columnId);
        return ResponseEntity.ok(cardService.create(request));
    }

    @PatchMapping("/cards/{cardId}")
    public ResponseEntity<BoardResponse> updateCard(@PathVariable UUID cardId,
                                                    @Valid @RequestBody CardUpdateRequest request) {
        return ResponseEntity.ok(cardService.update(cardId, request));
    }

    @DeleteMapping("/cards/{cardId}")
    public ResponseEntity<BoardResponse> deleteCard(@PathVariable UUID cardId) {
        return ResponseEntity.ok(cardService.delete(cardId));
    }
}
