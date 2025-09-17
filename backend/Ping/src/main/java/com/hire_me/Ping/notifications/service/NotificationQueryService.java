package com.hire_me.Ping.notifications.service;
import com.hire_me.Ping.notifications.dto.NotificationResponse;
import com.hire_me.Ping.notifications.entity.Notification;
import com.hire_me.Ping.notifications.entity.NotificationStatus;
import com.hire_me.Ping.notifications.entity.NotificationType;
import com.hire_me.Ping.notifications.mapper.NotificationMapper;
import com.hire_me.Ping.notifications.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Query service using existing repository methods with in-memory filtering.
 */
@Service
public class NotificationQueryService {

    private final NotificationRepository repo;
    private final NotificationMapper mapper;

    public NotificationQueryService(NotificationRepository repo, NotificationMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PagedResult list(
            UUID userId,
            StatusFilter statusFilter,
            NotificationType typeFilter,
            OffsetDateTime since,
            OffsetDateTime before,
            int page,
            int size
    ) {
        int safeSize = Math.max(1, Math.min(size, 100));

        List<Notification> rows = (statusFilter == StatusFilter.UNREAD)
                ? repo.findByRecipientUserIdAndStatusOrderByCreatedAtDesc(userId, NotificationStatus.UNREAD)
                : repo.findByRecipientUserIdOrderByCreatedAtDesc(userId);

        // In-memory filter by type/time if provided
        List<Notification> filtered = new ArrayList<>(rows);
        if (typeFilter != null) {
            filtered.removeIf(n -> n.getType() != typeFilter);
        }
        if (since != null) {
            filtered.removeIf(n -> n.getCreatedAt() == null || n.getCreatedAt().isBefore(since));
        }
        if (before != null) {
            filtered.removeIf(n -> n.getCreatedAt() == null || !n.getCreatedAt().isBefore(before));
        }

        // Ensure newest first
        filtered.sort(Comparator.comparing(Notification::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed());

        int from = Math.max(0, page * safeSize);
        int to = Math.min(filtered.size(), from + safeSize);
        List<Notification> pageSlice = from < to ? filtered.subList(from, to) : List.of();

        List<NotificationResponse> items = pageSlice.stream().map(mapper::toResponse).toList();
        boolean hasMore = to < filtered.size();

        return new PagedResult(items, hasMore, hasMore ? page + 1 : null);
    }

    @Transactional(readOnly = true)
    public CursorResult listByCursor(
            UUID userId,
            StatusFilter statusFilter,
            NotificationType typeFilter,
            OffsetDateTime since,
            OffsetDateTime before,
            int limit,
            CursorKey after
    ) {
        int safeLimit = Math.max(1, Math.min(limit, 100));

        List<Notification> rows = (statusFilter == StatusFilter.UNREAD)
                ? repo.findByRecipientUserIdAndStatusOrderByCreatedAtDesc(userId, NotificationStatus.UNREAD)
                : repo.findByRecipientUserIdOrderByCreatedAtDesc(userId);

        // Filter by type/time
        List<Notification> filtered = new ArrayList<>(rows);
        if (typeFilter != null) {
            filtered.removeIf(n -> n.getType() != typeFilter);
        }
        if (since != null) {
            filtered.removeIf(n -> n.getCreatedAt() == null || n.getCreatedAt().isBefore(since));
        }
        if (before != null) {
            filtered.removeIf(n -> n.getCreatedAt() == null || !n.getCreatedAt().isBefore(before));
        }
        // Apply cursor (createdAt DESC, id DESC) — keep items strictly before the cursor
        if (after != null) {
            filtered.removeIf(n -> {
                if (n.getCreatedAt() == null) return true;
                int cmp = n.getCreatedAt().compareTo(after.createdAt());
                if (cmp < 0) return false; // n is older -> keep
                if (cmp > 0) return true;  // n is newer -> drop
                // equal createdAt -> compare id desc
                return n.getId() == null || n.getId().compareTo(after.id()) >= 0;
            });
        }

        // Already sorted DESC by repo; enforce just in case
        filtered.sort(Comparator.comparing(Notification::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed());

        boolean hasMore = filtered.size() > safeLimit;
        List<Notification> slice = hasMore ? filtered.subList(0, safeLimit) : filtered;
        List<NotificationResponse> items = slice.stream().map(mapper::toResponse).toList();

        CursorKey next = slice.isEmpty() ? null : new CursorKey(
                slice.get(slice.size() - 1).getCreatedAt(),
                slice.get(slice.size() - 1).getId()
        );

        return new CursorResult(items, next, hasMore);
    }

    // Helper DTOs for pagination results
    public record PagedResult(List<NotificationResponse> items, boolean hasMore, Integer nextPage) {}
    public record CursorKey(OffsetDateTime createdAt, UUID id) {}
    public record CursorResult(List<NotificationResponse> items, CursorKey nextCursor, boolean hasMore) {}

    public enum StatusFilter { UNREAD, ALL }
}
