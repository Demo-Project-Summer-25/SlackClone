package com.hire_me.Ping.messages.dto;

import com.hire_me.Ping.messages.entity.Message.ContentType;

import java.time.LocalDateTime;
import java.util.UUID;

// DTO for sending message data to clients
public record MessageResponse(
    UUID id,
    Long channelId,
    UUID directConversationId,
    UUID senderUserId,
    String content,
    ContentType contentType,
    boolean deleted,
    LocalDateTime createdAt,
    LocalDateTime editedAt
) {}
