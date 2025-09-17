package com.hire_me.Ping.notifications.ws;

/**
 * STOMP destinations used for notifications (can be extended later).
 */
public final class NotificationChannels {
    private NotificationChannels() {}

    public static final String USER_QUEUE_PREFIX = "/user"; // Spring’s user destination prefix
    public static final String NOTIFICATIONS_QUEUE = "/queue/notifications";

    /**
     * Per-user destination for new notifications.
     * Clients subscribe to: /user/queue/notifications
     */
    public static String userNotifications() {
        return NOTIFICATIONS_QUEUE;
    }
}
