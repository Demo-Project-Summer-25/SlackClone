package com.hire_me.Ping.messages.repository;

import com.hire_me.Ping.messages.entity.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

  // Channel message queries
  List<Message> findByChannelIdOrderByCreatedAtDesc(UUID channelId, Pageable pageable);

  List<Message> findByChannelIdAndIdAfterOrderByCreatedAtDesc(UUID channelId, UUID afterId, Pageable pageable);

  // DM message queries
  List<Message> findByDirectConversationIdOrderByCreatedAtDesc(UUID directConversationId, Pageable pageable);

  List<Message> findByDirectConversationIdAndIdAfterOrderByCreatedAtDesc(UUID directConversationId, UUID afterId,
      Pageable pageable);

  // Sender queries
  List<Message> findBySenderUserIdOrderByCreatedAtDesc(UUID senderUserId, Pageable pageable);

  // Additional useful queries
  List<Message> findByChannelIdAndDeletedFalseOrderByCreatedAtDesc(UUID channelId, Pageable pageable);

  List<Message> findByDirectConversationIdAndDeletedFalseOrderByCreatedAtDesc(UUID directConversationId,
      Pageable pageable);

  // Add this to MessageRepository
  // MessageRepository.java
List<Message> findByChannelIdOrderByCreatedAtAsc(UUID channelId, Pageable pageable);

List<Message> findByChannelIdAndIdAfterOrderByCreatedAtAsc(UUID channelId, UUID afterId, Pageable pageable);


}
