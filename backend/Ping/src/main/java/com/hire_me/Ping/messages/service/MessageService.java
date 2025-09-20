package com.hire_me.Ping.messages.service;

import com.hire_me.Ping.messages.dto.MessageCreateRequest;
import com.hire_me.Ping.messages.dto.MessageResponse;
import com.hire_me.Ping.messages.dto.MessageUpdateRequest;
import com.hire_me.Ping.messages.entity.Message;
import com.hire_me.Ping.messages.mapper.MessageMapper;
import com.hire_me.Ping.messages.repository.MessageRepository;
import com.hire_me.Ping.messages.ws.MessageEvents;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;  // Changed from LocalDateTime
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class MessageService {

  private final MessageRepository repository;
  private final MessageMapper mapper;
  private final MessageEvents events;

  public MessageService(MessageRepository repository, MessageMapper mapper, MessageEvents events) {
    this.repository = repository;
    this.mapper = mapper;
    this.events = events;
  }

  public static record PageParams(UUID after, int limit) {}

  // ===============================
  // CHANNEL MESSAGE OPERATIONS
  // ===============================

  // public List<MessageResponse> listChannel(UUID channelId, PageParams params) {
  //   List<Message> messages;
    
  //   if (params.after() != null) {
  //     messages = repository.findByChannelIdAndIdAfterOrderByCreatedAtDesc(
  //         channelId, params.after(), PageRequest.of(0, params.limit()));
  //   } else {
  //     messages = repository.findByChannelIdOrderByCreatedAtDesc(
  //         channelId, PageRequest.of(0, params.limit()));
  //   }
    
  //   return messages.stream()
  //       .map(mapper::toResponse)
  //       .toList();
  // }

  public List<MessageResponse> listChannel(UUID channelId, PageParams params) {
    List<Message> messages;

    if (params.after() != null) {
        messages = repository.findByChannelIdAndIdAfterOrderByCreatedAtAsc(
            channelId, params.after(), PageRequest.of(0, params.limit()));
    } else {
        messages = repository.findByChannelIdOrderByCreatedAtAsc(
            channelId, PageRequest.of(0, params.limit()));
    }

    return messages.stream()
        .map(mapper::toResponse)
        .toList();
}


  public MessageResponse postToChannel(UUID channelId, MessageCreateRequest req) {
    if (req.senderUserId() == null) {
      throw new IllegalArgumentException("Sender user ID cannot be null");
    }
    if (req.content() == null || req.content().trim().isEmpty()) {
      throw new IllegalArgumentException("Message content cannot be empty");
    }
    
    Message message = new Message();
    message.setChannelId(channelId);
    message.setSenderUserId(req.senderUserId());
    message.setContent(req.content().trim());
    message.setContentType(req.contentType() != null ? req.contentType() : Message.ContentType.TEXT);
    message.setDeleted(false);
    message.setCreatedAt(Instant.now());  // Changed from LocalDateTime.now()
    
    Message saved = repository.save(message);
    MessageResponse dto = mapper.toResponse(saved);

    // 🔥 broadcast new message to subscribers
    events.toChannel(channelId, MessageEvents.EventType.created, dto);

    return dto;
  }

  // ===============================
  // DM MESSAGE OPERATIONS
  // ===============================

  public List<MessageResponse> listDm(UUID dmId, PageParams params) {
    List<Message> messages;
    
    if (params.after() != null) {
      messages = repository.findByDirectConversationIdAndIdAfterOrderByCreatedAtDesc(
          dmId, params.after(), PageRequest.of(0, params.limit()));
    } else {
      messages = repository.findByDirectConversationIdOrderByCreatedAtDesc(
          dmId, PageRequest.of(0, params.limit()));
    }
    
    return messages.stream()
        .map(mapper::toResponse)
        .toList();
  }

  public MessageResponse postToDm(UUID dmId, MessageCreateRequest req) {
    if (req.senderUserId() == null) {
      throw new IllegalArgumentException("Sender user ID cannot be null");
    }
    if (req.content() == null || req.content().trim().isEmpty()) {
      throw new IllegalArgumentException("Message content cannot be empty");
    }
    
    Message message = new Message();
    message.setDirectConversationId(dmId);
    message.setSenderUserId(req.senderUserId());
    message.setContent(req.content().trim());
    message.setContentType(req.contentType() != null ? req.contentType() : Message.ContentType.TEXT);
    message.setDeleted(false);
    message.setCreatedAt(Instant.now());  // Changed from LocalDateTime.now()
    
    Message saved = repository.save(message);
    return mapper.toResponse(saved);
  }

  // ===============================
  // EDIT/DELETE OPERATIONS
  // ===============================

  public MessageResponse edit(UUID messageId, MessageUpdateRequest req) {
    if (req.content() == null || req.content().trim().isEmpty()) {
      throw new IllegalArgumentException("Message content cannot be empty");
    }
    
    Message message = repository.findById(messageId)
        .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
    
    if (message.isDeleted()) {
      throw new RuntimeException("Cannot edit deleted message");
    }
    
    message.setContent(req.content().trim());
    message.setEditedAt(Instant.now());  // Changed from LocalDateTime.now()
    
    Message saved = repository.save(message);
    return mapper.toResponse(saved);
  }

  public void delete(UUID messageId) {
    Message message = repository.findById(messageId)
        .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
    
    message.setDeleted(true);
    repository.save(message);
  }

  // ===============================
  // UTILITY METHODS
  // ===============================

  public MessageResponse findById(UUID messageId) {
    Message message = repository.findById(messageId)
        .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
    return mapper.toResponse(message);
  }

  public List<MessageResponse> listUserMessages(UUID userId, int limit) {
    List<Message> messages = repository.findBySenderUserIdOrderByCreatedAtDesc(
        userId, PageRequest.of(0, limit));
    return messages.stream()
        .map(mapper::toResponse)
        .toList();
  }
}
