package com.hire_me.Ping.channels.controller;

import com.hire_me.Ping.channels.dto.ChannelMemberRequest;
import com.hire_me.Ping.channels.dto.ChannelMemberResponse;
import com.hire_me.Ping.channels.service.ChannelMemberService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/channels/{channelId}/members")
public class ChannelMemberController {

    private final ChannelMemberService memberService;

    @Autowired
    public ChannelMemberController(ChannelMemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public ResponseEntity<List<ChannelMemberResponse>> getChannelMembers(@PathVariable Long channelId) {
        return ResponseEntity.ok(memberService.getChannelMembers(channelId));
    }

    @PostMapping
    public ResponseEntity<ChannelMemberResponse> addMember(
            @PathVariable Long channelId, 
            @Valid @RequestBody ChannelMemberRequest memberRequest) {
        UUID requesterId = getAuthenticatedUserId(); // Placeholder
        ChannelMemberResponse response = memberService.addMember(channelId, memberRequest, requesterId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long channelId, @PathVariable UUID userId) {
        UUID requesterId = getAuthenticatedUserId(); // Placeholder
        memberService.removeMember(channelId, userId, requesterId);
        return ResponseEntity.noContent().build();
    }
    
    private UUID getAuthenticatedUserId() {
        // TODO: Replace with your actual security logic
        return UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479");
    }
}