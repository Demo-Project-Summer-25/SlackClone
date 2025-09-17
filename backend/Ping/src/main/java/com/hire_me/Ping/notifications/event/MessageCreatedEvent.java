package com.hire_me.Ping.notifications.event;

import java.util.UUID;

/**
 * Placeholder domain event representing a new message created.
 * Extend with fields and publish as needed in your app.
 */
public class MessageCreatedEvent {
    private final UUID messageId;

    public MessageCreatedEvent(UUID messageId) { this.messageId = messageId; }
    public UUID getMessageId() { return messageId; }
}
