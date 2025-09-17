package com.hire_me.Ping.messages.dto;

import com.hire_me.Ping.messages.entity.Message.ContentType;
import java.time.Instant;

// DTO for sending message data to clients
public record MessageResponse(
    Long id,
    Long channelId,
    Long directConversationId,
    Long senderUserId,
    String content,
    ContentType contentType,
    boolean deleted,
    Instant createdAt,
    Instant editedAt
) {}
