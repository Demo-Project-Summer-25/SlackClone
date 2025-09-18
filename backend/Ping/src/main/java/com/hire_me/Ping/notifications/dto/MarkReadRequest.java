package com.hire_me.Ping.notifications.dto;

import java.util.List;
import java.util.UUID;

/**
 * Request body to mark one or many notifications as READ.
 * Use with a bulk endpoint like POST /notifications/read
 * (Your single-item endpoint /{id}/read can have no body.)
 */
public record MarkReadRequest(
        List<UUID> ids // required: list of notification ids to mark READ
) {
    public boolean isEmpty() {
        return ids == null || ids.isEmpty();
    }
}

