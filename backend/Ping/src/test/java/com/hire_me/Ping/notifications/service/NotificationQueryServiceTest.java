package com.hire_me.Ping.notifications.service;

import com.hire_me.Ping.notifications.dto.NotificationResponse;
import com.hire_me.Ping.notifications.entity.Notification;
import com.hire_me.Ping.notifications.entity.NotificationStatus;
import com.hire_me.Ping.notifications.entity.NotificationType;
import com.hire_me.Ping.notifications.mapper.NotificationMapper;
import com.hire_me.Ping.notifications.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class NotificationQueryServiceTest {

    NotificationRepository repo;
    NotificationMapper mapper;
    NotificationQueryService service;

    @BeforeEach
    void setUp() {
        repo = mock(NotificationRepository.class);
        mapper = mock(NotificationMapper.class);
        service = new NotificationQueryService(repo, mapper);

        when(mapper.toResponse(any())).thenAnswer(inv -> {
            Notification n = inv.getArgument(0);
            return new NotificationResponse(
                    n.getId(), n.getText(), n.getType(), n.getStatus(), n.getCreatedAt(), n.getReadAt(),
                    n.getMessageId(), n.getDirectConversationId(), n.getChannelId()
            );
        });
    }

    @Test
    void list_filtersByTypeAndPaginates() {
        UUID user = UUID.randomUUID();
        var now = OffsetDateTime.now();
        Notification n1 = Notification.generic(user, UUID.randomUUID(), null, null, NotificationType.MESSAGE, "a");
        Notification n2 = Notification.generic(user, UUID.randomUUID(), null, null, NotificationType.MENTION, "b");
        Notification n3 = Notification.generic(user, UUID.randomUUID(), null, null, NotificationType.MENTION, "c");
        // simulate createdAt differences
        when(repo.findByRecipientUserIdOrderByCreatedAtDesc(user)).thenReturn(List.of(n3, n2, n1));

        var out = service.list(user,
                NotificationQueryService.StatusFilter.ALL,
                NotificationType.MENTION,
                now.minusDays(1),
                null,
                0,
                1
        );

        assertThat(out.items()).hasSize(1);
        assertThat(out.hasMore()).isTrue();
        assertThat(out.nextPage()).isEqualTo(1);
        verify(mapper, times(1)).toResponse(any());
    }

    @Test
    void listByCursor_appliesCursorAndLimit() {
        UUID user = UUID.randomUUID();
        var t1 = OffsetDateTime.now();
        Notification n1 = Notification.generic(user, UUID.randomUUID(), null, UUID.randomUUID(), NotificationType.MESSAGE, "1");
        Notification n2 = Notification.generic(user, UUID.randomUUID(), null, UUID.randomUUID(), NotificationType.MESSAGE, "2");
        Notification n3 = Notification.generic(user, UUID.randomUUID(), null, UUID.randomUUID(), NotificationType.MESSAGE, "3");

        when(repo.findByRecipientUserIdOrderByCreatedAtDesc(user)).thenReturn(List.of(n3, n2, n1));

        var out = service.listByCursor(
                user,
                NotificationQueryService.StatusFilter.ALL,
                null,
                null,
                null,
                2,
                new NotificationQueryService.CursorKey(t1.plusSeconds(1), UUID.randomUUID()) // cursor newer than all -> all eligible
        );

        assertThat(out.items()).hasSize(2);
        assertThat(out.hasMore()).isTrue();
        assertThat(out.nextCursor()).isNotNull();
        verify(mapper, times(2)).toResponse(any());
    }
}

