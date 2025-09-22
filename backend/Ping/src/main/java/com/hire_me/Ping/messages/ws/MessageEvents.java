package com.hire_me.Ping.messages.ws;

import com.hire_me.Ping.messages.dto.MessageResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

// Handles WebSocket events for messages
@Component
public class MessageEvents {

  private final SimpMessagingTemplate simp;

  public MessageEvents(SimpMessagingTemplate simp) {
    this.simp = simp;
  }

  // Types of message events
  public enum EventType { created, updated, deleted }

  // Payload sent to clients
  public static final class Payload {
    private EventType type;
    private MessageResponse message;

    // Constructor, getters
    public Payload(EventType type, MessageResponse message) {
      this.type = type;
      this.message = message;
    }
    public EventType getType() { return type; }
    public MessageResponse getMessage() { return message; }
  }

  // Send message event to channel or DM subscribers
  public void toChannel(Long channelId, EventType type, MessageResponse msg) {
    simp.convertAndSend("/topic/channels/" + channelId, new Payload(type, msg));
  }

  // Send message event to channel or DM subscribers
  public void toDm(Long dmId, EventType type, MessageResponse msg) {
    simp.convertAndSend("/topic/dms/" + dmId, new Payload(type, msg));
  }
}
