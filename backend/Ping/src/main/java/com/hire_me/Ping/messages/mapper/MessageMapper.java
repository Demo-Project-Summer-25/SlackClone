package com.hire_me.Ping.messages.mapper;

import com.hire_me.Ping.messages.dto.MessageResponse;
import com.hire_me.Ping.messages.entity.Message;
import org.springframework.stereotype.Component;

// Maps Message entity to MessageResponse DTO
@Component
public class MessageMapper {
  
  public MessageResponse toResponse(Message m) {
    if (m == null) {
      return null;
    }
    
    // If the message is deleted, we return empty content 
    String safeContent = m.isDeleted() ? "[This message was deleted]" : m.getContent();

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
