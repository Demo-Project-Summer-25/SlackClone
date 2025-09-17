package com.hire_me.Ping.messages.dto;

import com.hire_me.Ping.messages.entity.Message.ContentType;

// DTO for creating a new message
public record MessageCreateRequest(
    Long senderUserId,         // client passes author id
    String content,
    ContentType contentType    // defaults to TEXT if null
) {}
