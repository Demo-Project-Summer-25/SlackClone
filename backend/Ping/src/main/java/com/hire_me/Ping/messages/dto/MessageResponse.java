package com.hire_me.Ping.messages.dto;

import com.hire_me.Ping.messages.entity.Message;
import java.time.Instant;
import java.util.UUID;

// DTO for sending message data to clients
public record MessageResponse(
    UUID id,
    Long channelId,
    UUID directConversationId,
    UUID senderUserId,
    String content,
    Message.ContentType contentType,
    boolean deleted,
    Instant createdAt,
    Instant editedAt
) {}
