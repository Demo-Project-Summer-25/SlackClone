package com.hire_me.Ping.dms.repo;

import com.hire_me.Ping.dms.entity.DirectConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface DirectConversationRepository extends JpaRepository<DirectConversation, UUID> {
    // Extends JpaRepository so you automatically get CRUD methods like:
    // - save(), findById(), findAll(), deleteById(), etc.
    // <DirectConversation, UUID> means:
    //   - The entity type is DirectConversation
    //   - Its primary key type is UUID


    // ---------------- CUSTOM QUERIES ----------------


    @Query("SELECT dp.directConversationId FROM DirectParticipant dp WHERE dp.userId = :userId AND dp.leftAt IS NULL")
    List<UUID> findActiveConversationIdsByUser(@Param("userId") UUID userId);
    // This query finds the IDs of all conversations where a given user is *currently active*.
    // - "dp.leftAt is null" means they haven't left the conversation.
    // Returns just the IDs, not the full conversation objects.


    @Query("SELECT dc FROM DirectConversation dc WHERE dc.id IN :ids")
    List<DirectConversation> findAllByIds(@Param("ids") List<UUID> ids);
    // Given a list of conversation IDs, this returns the full DirectConversation entities.
    // Useful when you already know which conversations matter and you just need details.


    @Query("select c from DirectConversation c where c.isGroup = false and c.id in (" +
            " select dp.directConversationId from DirectParticipant dp " +
            " where dp.userId in (:u1, :u2) and dp.leftAt is null " +
            " group by dp.directConversationId having count(distinct dp.userId) = 2)")
    Optional<DirectConversation> findDirectBetween(@Param("u1") UUID user1, @Param("u2") UUID user2);
    // This query tries to find a one-on-one (non-group) DM between two specific users.
    // - c.isGroup = false ensures it's not a group chat.
    // - Inner query: find conversation IDs where BOTH user1 and user2 are present,
    //   and neither has left (leftAt is null).
    // - group by + having count(distinct dp.userId) = 2 ensures the conversation has exactly these 2 users.
    // Returns Optional<DirectConversation> because there might be zero or one result.
}