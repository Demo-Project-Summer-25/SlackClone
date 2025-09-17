package com.hire_me.Ping.messages.mapper;

import com.hire_me.Ping.messages.dto.MessageResponse;
import com.hire_me.Ping.messages.entity.Message;
import org.springframework.stereotype.Component;

// Maps Message entity to MessageResponse DTO
@Component
public class MessageMapper {
  public MessageResponse toResponse(Message m) {
    String safeContent = m.isDeleted() ? "" : m.getContent();

    // If the message is deleted, we return empty content 
    return new MessageResponse(
        m.getId(),
        m.getChannelId(),
        m.getDirectConversationId(),
        m.getSenderUserId(),
        safeContent,
        m.getContentType(),
        m.isDeleted(),
        m.getCreatedAt(),
        m.getEditedAt()
    );
  }
}
