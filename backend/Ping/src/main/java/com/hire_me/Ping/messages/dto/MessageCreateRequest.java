package com.hire_me.Ping.messages.dto;

import com.hire_me.Ping.messages.entity.Message;
import java.util.UUID;

// DTO for creating a new message
public record MessageCreateRequest(
    UUID senderUserId,
    String content,
    Message.ContentType contentType
) {}
