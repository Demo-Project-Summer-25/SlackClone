package com.hire_me.Ping.messages.service;

import com.hire_me.Ping.messages.dto.MessageCreateRequest;
import com.hire_me.Ping.messages.dto.MessageResponse;
import com.hire_me.Ping.messages.dto.MessageUpdateRequest;
import com.hire_me.Ping.messages.entity.Message;
import com.hire_me.Ping.messages.mapper.MessageMapper;
import com.hire_me.Ping.messages.repo.MessageRepository;
import com.hire_me.Ping.messages.ws.MessageEvents;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;

// Service layer for managing messages
@Service
public class MessageService {

    // Dependencies
  private final MessageRepository repo;
  private final MessageMapper mapper;
  private final MessageEvents events;

  // Constructor injection
  public MessageService(MessageRepository repo, MessageMapper mapper, MessageEvents events) {
    this.repo = repo;
    this.mapper = mapper;
    this.events = events;
  }

  /* -------- Simple value object for paging -------- */

  // Parameters for paginating message lists
  public static final class PageParams {
    private final Long after;
    private final int limit;
    public PageParams(Long after, int limit) {
      this.after = after;
      this.limit = limit;
    }
    public Long after() { return after; }
    public int limit() { return limit; }
  }

  /* ---------------- Queries ---------------- */

  // List messages in a channel
  public Object listChannel(Long channelId, PageParams p) {
    var pageable = PageRequest.of(0, clamp(p.limit()));
    var page = (p.after() == null)
        ? repo.findByChannelIdAndDeletedFalseOrderByCreatedAtAsc(channelId, pageable)
        : repo.findByChannelIdAndIdGreaterThanAndDeletedFalseOrderByCreatedAtAsc(channelId, p.after(), pageable);
    return page.map(mapper::toResponse);
  }

  // List messages in a direct conversation (DM)
  public Object listDm(Long dmId, PageParams p) {
    var pageable = PageRequest.of(0, clamp(p.limit()));
    var page = (p.after() == null)
        ? repo.findByDirectConversationIdAndDeletedFalseOrderByCreatedAtAsc(dmId, pageable)
        : repo.findByDirectConversationIdAndIdGreaterThanAndDeletedFalseOrderByCreatedAtAsc(dmId, p.after(), pageable);
    return page.map(mapper::toResponse);
  }

  /* ---------------- Commands ---------------- */

  // Post a new message to a channel
  public MessageResponse postToChannel(Long channelId, MessageCreateRequest req) {
    Message m = new Message();
    m.setChannelId(channelId);
    m.setSenderUserId(req.senderUserId());
    m.setContent(req.content());
    m.setContentType(req.contentType()); // may be null; entity @PrePersist sets TEXT
    m.setCreatedAt(Instant.now());
    m.setDeleted(false);

    // Save the message
    Message saved = repo.save(m);
    MessageResponse resp = mapper.toResponse(saved);
    events.toChannel(channelId, MessageEvents.EventType.created, resp);
    return resp;
  }

  // Post a new message to a direct conversation (DM)
  public MessageResponse postToDm(Long dmId, MessageCreateRequest req) {
    Message m = new Message();
    m.setDirectConversationId(dmId);
    m.setSenderUserId(req.senderUserId());
    m.setContent(req.content());
    m.setContentType(req.contentType());
    m.setCreatedAt(Instant.now());
    m.setDeleted(false);

    // Save the message
    Message saved = repo.save(m);
    MessageResponse resp = mapper.toResponse(saved);
    events.toDm(dmId, MessageEvents.EventType.created, resp);
    return resp;
  }

  // Edit an existing message
  public MessageResponse edit(Long messageId, MessageUpdateRequest req) {
    Message m = repo.findById(messageId).orElseThrow();
    m.setContent(req.content());
    m.setEditedAt(Instant.now());
    Message saved = repo.save(m);
    MessageResponse resp = mapper.toResponse(saved);
    publish(saved, MessageEvents.EventType.updated, resp);
    return resp;
  }

  // delete a message
  public void delete(Long messageId) {
    Message m = repo.findById(messageId).orElseThrow();
    m.setDeleted(true);
    m.setEditedAt(Instant.now());
    Message saved = repo.save(m);
    MessageResponse resp = mapper.toResponse(saved);
    publish(saved, MessageEvents.EventType.deleted, resp);
  }

  /* ---------------- Helpers ---------------- */

  // Publish message event to appropriate subscribers
  private void publish(Message m, MessageEvents.EventType type, MessageResponse resp) {
    if (m.getChannelId() != null) {
      events.toChannel(m.getChannelId(), type, resp);
    } else if (m.getDirectConversationId() != null) {
      events.toDm(m.getDirectConversationId(), type, resp);
    }
  }

  // Clamp limit to [1..200]
  private int clamp(int limit) {
    if (limit < 1) return 1;
    return Math.min(limit, 200);
  }
}
