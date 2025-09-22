package com.hire_me.Ping.notifications.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.hire_me.Ping.notifications.entity.NotificationType;

/**
 * Filters and pagination for listing notifications.
 * Supports simple "limit" and optional cursor paging.
 */
public record ListNotificationsRequest(
        Status status,                // UNREAD or ALL (default ALL if null)
        Integer limit,                // page size; server will cap (e.g., 100)
        NotificationType type,        // optional: filter by type (MESSAGE, MENTION, ...)

        // Optional time window filters
        OffsetDateTime since,         // include items created >= since
        OffsetDateTime before,        // include items created < before

        // Optional cursor for stable pagination on (createdAt DESC, id DESC)
        OffsetDateTime cursorCreatedAt,
        UUID cursorId
) {
    public enum Status { UNREAD, ALL }

    public int safeLimit(int defaultValue, int max) {
        int d = (limit == null ? defaultValue : limit);
        return Math.max(1, Math.min(d, max));
    }

    public boolean hasCursor() {
        return cursorCreatedAt != null && cursorId != null;
    }
}

