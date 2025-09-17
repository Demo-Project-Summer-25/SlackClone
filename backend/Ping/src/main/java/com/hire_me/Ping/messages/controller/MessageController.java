package com.hire_me.Ping.messages.controller;

import com.hire_me.Ping.messages.dto.MessageCreateRequest;
import com.hire_me.Ping.messages.dto.MessageUpdateRequest;
import com.hire_me.Ping.messages.entity.Message.ContentType;
import com.hire_me.Ping.messages.service.MessageService;
import com.hire_me.Ping.messages.service.MessageService.PageParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// REST controller for message-related endpoints
@RestController
@RequestMapping("/api")
public class MessageController {

  private final MessageService service;

  // Constructor injection
  public MessageController(MessageService service) {
    this.service = service;
  }

  /* -------- Channel messages -------- */

  // List messages in a channel
  @GetMapping("/channels/{channelId}/messages")
  public ResponseEntity<?> listChannel(@PathVariable Long channelId,
                                       @RequestParam(required = false) Long after,
                                       @RequestParam(defaultValue = "50") int limit) {
    return ResponseEntity.ok(service.listChannel(channelId, new PageParams(after, limit)));
  }

  // Post a new message to a channel
  @PostMapping("/channels/{channelId}/messages")
  public ResponseEntity<?> postChannel(@PathVariable Long channelId,
                                       @RequestBody MessageCreateRequest req) {
    // default to TEXT if client omitted
    if (req.contentType() == null) {
      req = new MessageCreateRequest(req.senderUserId(), req.content(), ContentType.TEXT);
    }
    return ResponseEntity.ok(service.postToChannel(channelId, req));
  }

  /* -------- DM messages -------- */

  // List messages in a direct conversation (DM)
  @GetMapping("/dms/{dmId}/messages")
  public ResponseEntity<?> listDm(@PathVariable Long dmId,
                                  @RequestParam(required = false) Long after,
                                  @RequestParam(defaultValue = "50") int limit) {
    return ResponseEntity.ok(service.listDm(dmId, new PageParams(after, limit)));
  }

  // Post a new message to a direct conversation (DM)
  @PostMapping("/dms/{dmId}/messages")
  public ResponseEntity<?> postDm(@PathVariable Long dmId,
                                  @RequestBody MessageCreateRequest req) {
    if (req.contentType() == null) {
      req = new MessageCreateRequest(req.senderUserId(), req.content(), ContentType.TEXT);
    }
    return ResponseEntity.ok(service.postToDm(dmId, req));
  }

  /* -------- Edit/Delete -------- */

  // Edit a message
  @PatchMapping("/messages/{messageId}")
  public ResponseEntity<?> edit(@PathVariable Long messageId,
                                @RequestBody MessageUpdateRequest req) {
    return ResponseEntity.ok(service.edit(messageId, req));
  }

  // Delete a message
  @DeleteMapping("/messages/{messageId}")
  public ResponseEntity<?> delete(@PathVariable Long messageId) {
    service.delete(messageId);
    return ResponseEntity.noContent().build();
  }
}
