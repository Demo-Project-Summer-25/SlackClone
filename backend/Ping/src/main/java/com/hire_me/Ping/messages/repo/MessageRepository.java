package com.hire_me.Ping.messages.repo;


import com.hire_me.Ping.messages.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

// Fetch messages in a channel or DM, excluding deleted ones, ordered by creation time
  Page<Message> findByChannelIdAndDeletedFalseOrderByCreatedAtAsc(Long channelId, Pageable pageable);

  // Fetch messages in a direct conversation (DM), excluding deleted ones, ordered by creation time
  Page<Message> findByDirectConversationIdAndDeletedFalseOrderByCreatedAtAsc(Long dmId, Pageable pageable);

  // Fetch messages in a channel or DM, excluding deleted ones, ordered by creation time
  Page<Message> findByChannelIdAndIdGreaterThanAndDeletedFalseOrderByCreatedAtAsc(Long channelId, Long afterId, Pageable pageable);

  // Fetch messages in a direct conversation (DM), excluding deleted ones, ordered by creation time
  Page<Message> findByDirectConversationIdAndIdGreaterThanAndDeletedFalseOrderByCreatedAtAsc(Long dmId, Long afterId, Pageable pageable);
}
