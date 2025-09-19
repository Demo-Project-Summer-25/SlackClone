package com.hire_me.Ping.notifications.ws;


import java.util.UUID;

/**
 * Central place for STOMP destination names and small helpers.
 * Keeps client and server in sync and avoids magic strings.
 */
public final class NotificationChannels {

    private NotificationChannels() {}

    /** Per-user queue base (used with convertAndSendToUser). */
    public static final String USER_QUEUE_NOTIFICATIONS = "/queue/notifications";

    /** Client subscription path for the current authenticated user. */
    public static final String USER_SUBSCRIPTION_NOTIFICATIONS = "/user" + USER_QUEUE_NOTIFICATIONS;

    /** (Optional) Example broadcast topic if you need one later. */
    public static final String TOPIC_ANNOUNCEMENTS = "/topic/announcements";

    /** Helper to visualize a specific user's destination (for logs/debug). */
    public static String describeUserNotifications(UUID userId) {
        return "/user/" + userId + USER_QUEUE_NOTIFICATIONS;
    }
}

