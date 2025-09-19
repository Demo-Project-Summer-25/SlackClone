package com.hire_me.Ping.messages.dto;

import com.hire_me.Ping.messages.entity.Message.ContentType;

import java.util.UUID;

// DTO for creating a new message
public record MessageCreateRequest(
    UUID senderUserId,
    String content,
    ContentType contentType
) {}
