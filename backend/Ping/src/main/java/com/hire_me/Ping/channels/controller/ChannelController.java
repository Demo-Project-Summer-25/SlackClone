package com.hire_me.Ping.channels.controller;

import com.hire_me.Ping.channels.dto.ChannelCreateRequest;
import com.hire_me.Ping.channels.dto.ChannelResponse;
import com.hire_me.Ping.channels.dto.ChannelUpdateRequest;
import com.hire_me.Ping.channels.entity.Channel;
import com.hire_me.Ping.channels.service.ChannelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping
    public ResponseEntity<ChannelResponse> createChannel(@Valid @RequestBody ChannelCreateRequest createRequest) {
        UUID currentUserId = getAuthenticatedUserId(); // Placeholder
        ChannelResponse response = channelService.createChannel(createRequest, currentUserId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelResponse> getChannelById(@PathVariable UUID channelId) {
        return ResponseEntity.ok(channelService.getChannelResponseById(channelId));
    }

    @PutMapping("/{channelId}")
    public ResponseEntity<ChannelResponse> updateChannel(@PathVariable UUID channelId,
            @Valid @RequestBody ChannelUpdateRequest updateRequest) {
        return ResponseEntity.ok(channelService.updateChannel(channelId, updateRequest));
    }

    @DeleteMapping("/{channelId}")
    public ResponseEntity<Void> deleteChannel(@PathVariable UUID channelId) {
        channelService.deleteChannel(channelId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChannelResponse>> getUserChannels(@PathVariable UUID userId) {
        return ResponseEntity.ok(channelService.getUserChannels(userId));
    }

    private UUID getAuthenticatedUserId() {
        // TODO: Replace with your actual security logic
        return UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");
    }
}