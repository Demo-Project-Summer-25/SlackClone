package com.hire_me.Ping.notifications.event;

import com.hire_me.Ping.notifications.entity.NotificationType;
import com.hire_me.Ping.notifications.service.NotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Listens for MessageCreatedEvent and creates/pushes a notification
 * once the message transaction commits successfully.
 */
@Component
public class NotificationEventHandler {

    private final NotificationService notifications;

    public NotificationEventHandler(NotificationService notifications) {
        this.notifications = notifications;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onMessageCreated(MessageCreatedEvent event) {
        NotificationType type = event.type() != null ? event.type() : NotificationType.MESSAGE;

        notifications.createNotification(
                event.recipientUserId(),
                event.actorUserId(),
                event.directConversationId(),
                event.channelId(),
                event.messageId(),
                type,
                event.text()
        );
    }
}
