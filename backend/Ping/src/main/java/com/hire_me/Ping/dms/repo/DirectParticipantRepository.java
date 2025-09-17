package com.hire_me.Ping.dms.repo;

import com.hire_me.Ping.dms.entity.DirectParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


public interface DirectParticipantRepository extends JpaRepository<DirectParticipant, Long> {
    // Extending JpaRepository gives us all the standard CRUD methods:
    // save(), findById(), findAll(), deleteById(), etc.
    // Entity = DirectParticipant, Primary key = Long


    // ---------- Custom Finder Methods ----------

    List<DirectParticipant> findByConversationId(Long conversationId);
    // Returns all participants in a given conversation.
    // Useful when you want to list everyone in a DM.


    List<DirectParticipant> findByUserIdAndLeftAtIsNull(Long userId);
    // Returns all conversations where this user is still active.
    // leftAt IS NULL = they have not left the conversation.


    boolean existsByConversationIdAndUserId(Long conversationId, Long userId);
    // Checks if a specific user is (or has been) in a conversation at any point.
    // Returns true/false.
    // Note: doesn’t check leftAt, so it could be true even if they left.


    Optional<DirectParticipant> findByConversationIdAndUserIdAndLeftAtIsNull(Long conversationId, Long userId);
    // Tries to find an active participant record for a given user in a given conversation.
    // Optional = may or may not exist.


    // ---------- Custom Default Method ----------
    default void softLeave(DirectParticipant participant, Instant leftAt) {
        // Instead of fully deleting the participant from the DB,
        // we "soft delete" them by setting leftAt = timestamp of when they left.
        // This preserves history (we know they were once in this DM).
        participant.setLeftAt(leftAt);

        // Save the updated participant back to the database.
        save(participant);
    }
}

