package com.hire_me.Ping.notifications.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hire_me.Ping.notifications.dto.ListNotificationsRequest;
import com.hire_me.Ping.notifications.dto.NotificationResponse;
import com.hire_me.Ping.notifications.entity.Notification;
import com.hire_me.Ping.notifications.entity.NotificationType;
import com.hire_me.Ping.notifications.mapper.NotificationMapper;
import com.hire_me.Ping.notifications.repository.NotificationRepository;
import com.hire_me.Ping.notifications.ws.NotificationPublisher;

class NotificationServiceTest {

    NotificationRepository repo;
    NotificationPublisher publisher;
    NotificationMapper mapper;
    NotificationService service;

    @BeforeEach
    void setUp() {
        repo = mock(NotificationRepository.class);
        publisher = mock(NotificationPublisher.class);
        mapper = mock(NotificationMapper.class);
        service = new NotificationService(repo, publisher, mapper);

        when(mapper.toResponse(any())).thenAnswer(inv -> {
            Notification n = inv.getArgument(0);
            return new NotificationResponse(
                    n.getId(), n.getText(), n.getType(), n.getStatus(), n.getCreatedAt(), n.getReadAt(),
                    n.getMessageId(), n.getDirectConversationId(), n.getChannelId()
            );
        });
    }

   

    @Test
    void list_all_appliesLimitAndMaps() {
        UUID user = UUID.randomUUID();
        Notification n1 = Notification.generic(user, UUID.randomUUID(), null, UUID.randomUUID(), NotificationType.MESSAGE, "t1");
        Notification n2 = Notification.generic(user, UUID.randomUUID(), null, UUID.randomUUID(), NotificationType.MESSAGE, "t2");
        when(repo.findByRecipientUserIdOrderByCreatedAtDesc(user)).thenReturn(List.of(n1, n2));

        var req = new ListNotificationsRequest(ListNotificationsRequest.Status.ALL, 1, null, null, null, null, null);
        List<NotificationResponse> items = service.listNotifications(user, req);

        assertThat(items).hasSize(1);
        verify(mapper, times(1)).toResponse(any());
    }

    @Test
    void createNotification_dm_savesPublishesAndMaps() {
        UUID user = UUID.randomUUID();
        UUID actor = UUID.randomUUID();
        UUID convo = UUID.randomUUID();
        UUID msg = UUID.randomUUID();

        ArgumentCaptor<Notification> saved = ArgumentCaptor.forClass(Notification.class);
        when(repo.save(any())).thenAnswer(inv -> {
            Notification n = inv.getArgument(0);
            return n; // echo back
        });

        NotificationResponse out = service.createNotification(
                user, actor, convo, null, msg, NotificationType.MESSAGE, "hello"
        );

        assertThat(out).isNotNull();
        verify(repo).save(saved.capture());
        Notification persisted = saved.getValue();
        assertThat(persisted.getRecipientUserId()).isEqualTo(user);
        assertThat(persisted.getDirectConversationId()).isEqualTo(convo);

        verify(publisher).publishNewNotification(eq(user), any(), anyString(), any(OffsetDateTime.class));
        verify(mapper).toResponse(any());
    }

    @Test
    void markAsRead_updatesOneRow() {
        UUID user = UUID.randomUUID();
        UUID id = UUID.randomUUID();
        when(repo.markAsRead(eq(id), eq(user), any())).thenReturn(1);

        boolean ok = service.markAsRead(user, id);
        assertThat(ok).isTrue();

        when(repo.markAsRead(eq(id), eq(user), any())).thenReturn(0);
        assertThat(service.markAsRead(user, id)).isFalse();
    }
}

