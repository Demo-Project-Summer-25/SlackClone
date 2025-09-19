package com.hire_me.Ping.dms.repo;

import com.hire_me.Ping.dms.entity.DirectParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
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


    // ---------- Custom Default Method ----------
    default void softLeave(DirectParticipant participant, LocalDateTime leftAt) {
        // Instead of fully deleting the participant from the DB,
        // we "soft delete" them by setting leftAt = timestamp of when they left.
        // This preserves history (we know they were once in this DM).
        participant.setLeftAt(leftAt);

        // Save the updated participant back to the database.
        save(participant);
    }
}

