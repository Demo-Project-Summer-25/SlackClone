package com.hire_me.Ping.dms.repo;

import com.hire_me.Ping.dms.entity.DirectParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface DirectParticipantRepository extends JpaRepository<DirectParticipant, UUID> {
    // Extending JpaRepository gives us all the standard CRUD methods:
    // save(), findById(), findAll(), deleteById(), etc.
    // Entity = DirectParticipant, Primary key = UUID


    // ---------- Custom Finder Methods ----------

    List<DirectParticipant> findByDirectConversationId(UUID directConversationId);
    // Returns all participants in a given conversation.
    // Useful when you want to list everyone in a DM.


    List<DirectParticipant> findByUserIdAndLeftAtIsNull(UUID userId);
    // Returns all conversations where this user is still active.
    // leftAt IS NULL = they have not left the conversation.


    boolean existsByDirectConversationIdAndUserId(UUID directConversationId, UUID userId);
    // Checks if a specific user is (or has been) in a conversation at any point.
    // Returns true/false.
    // Note: doesn't check leftAt, so it could be true even if they left.


    Optional<DirectParticipant> findByDirectConversationIdAndUserIdAndLeftAtIsNull(UUID directConversationId, UUID userId);
    // Tries to find an active participant record for a given user in a given conversation.
    // Optional = may or may not exist.


    // ---------- Custom Queries ----------

    @Query("SELECT dp FROM DirectParticipant dp WHERE dp.directConversationId = :conversationId AND dp.leftAt IS NULL")
    List<DirectParticipant> findActiveParticipants(@Param("conversationId") UUID conversationId);
    // Returns all active participants in a given conversation.
    // Custom query to find participants where leftAt is NULL.


    @Query("SELECT dp FROM DirectParticipant dp WHERE dp.userId = :userId AND dp.leftAt IS NULL")
    List<DirectParticipant> findActiveParticipantsByUser(@Param("userId") UUID userId);
    // Returns all active conversations for a given user.
    // Custom query to find conversations where leftAt is NULL.


    @Query("SELECT dp FROM DirectParticipant dp WHERE dp.directConversationId = :conversationId AND dp.userId = :userId")
    DirectParticipant findByConversationAndUser(@Param("conversationId") UUID conversationId, @Param("userId") UUID userId);
    // Finds a participant by conversation and user ID.
    // Custom query for direct lookup.


    // ---------- Custom Default Method ----------
    default void softLeave(DirectParticipant participant, Instant leftAt) {
        // Instead of fully deleting the participant from the DB,
        // we "soft delete" them by setting leftAt = timestamp of when they left.
        // This preserves history (we know they were once in this DM).
        participant.setLeftAt(leftAt);

        // Save the updated participant back to the database.
        save(participant);
    }
    
    // Convenience method to soft leave with current timestamp
    default void softLeave(DirectParticipant participant) {
        softLeave(participant, Instant.now());
    }
}

