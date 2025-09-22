package com.hire_me.Ping.bots.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.UUID;
import com.hire_me.Ping.bots.service.BotService;
import com.hire_me.Ping.bots.dto.BotIntegrationPublicDto;
import com.hire_me.Ping.bots.dto.BotCreateRequest;
import com.hire_me.Ping.bots.dto.BotUpdateRequest;

@RestController
@RequestMapping("/api/bots")
public class BotController {
    private final BotService botService;
    
    public BotController(BotService botService) {
        this.botService = botService;
    }
    
    // Create new bot for a user
    @PostMapping("/users/{userId}")
    public ResponseEntity<BotIntegrationPublicDto> createBot(
            @PathVariable UUID userId,
            @RequestBody BotCreateRequest request) {
        BotIntegrationPublicDto createdBot = botService.createBot(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBot);
    }
    
    // Get bot by ID
    @GetMapping("/{botId}")
    public ResponseEntity<BotIntegrationPublicDto> getBotById(@PathVariable UUID botId) {
        BotIntegrationPublicDto bot = botService.getBotById(botId);
        return ResponseEntity.ok(bot);
    }
    
    // Get all bots for a user
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<BotIntegrationPublicDto>> getUserBots(@PathVariable UUID userId) {
        List<BotIntegrationPublicDto> bots = botService.getUserBots(userId);
        return ResponseEntity.ok(bots);
    }
    
    // Get active bots for a user
    @GetMapping("/users/{userId}/active")
    public ResponseEntity<List<BotIntegrationPublicDto>> getUserActiveBots(@PathVariable UUID userId) {
        List<BotIntegrationPublicDto> activeBots = botService.getUserActiveBots(userId);
        return ResponseEntity.ok(activeBots);
    }
    
    // Update bot
    @PutMapping("/{botId}")
    public ResponseEntity<BotIntegrationPublicDto> updateBot(
            @PathVariable UUID botId,
            @RequestBody BotUpdateRequest request) {
        BotIntegrationPublicDto updatedBot = botService.updateBot(botId, request);
        return ResponseEntity.ok(updatedBot);
    }
    
    // Delete bot
    @DeleteMapping("/{botId}")
    public ResponseEntity<Void> deleteBot(@PathVariable UUID botId) {
        botService.deleteBot(botId);
        return ResponseEntity.noContent().build();
    }
    
    // Get bot count for user
    @GetMapping("/users/{userId}/count")
    public ResponseEntity<Long> getUserBotCount(@PathVariable UUID userId) {
        long count = botService.getUserBotCount(userId);
        return ResponseEntity.ok(count);
    }
}
