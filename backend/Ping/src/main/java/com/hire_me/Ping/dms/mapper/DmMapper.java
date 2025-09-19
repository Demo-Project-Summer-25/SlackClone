package com.hire_me.Ping.dms.mapper;

import com.hire_me.Ping.dms.dto.DmCreateRequest;
import com.hire_me.Ping.dms.dto.DmParticipantRequest;
import com.hire_me.Ping.dms.dto.DmResponse;
import com.hire_me.Ping.dms.entity.DirectConversation;
import com.hire_me.Ping.dms.entity.DirectParticipant;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

// This class contains pure conversion methods.
// It should be stateless: no fields, just functions that take input objects and
// produce output objects.

@Component
public class DmMapper {

    // ----------------- Request DTO -> Entity (DirectConversation) -----------------
    public DirectConversation toConversation(DmCreateRequest req) {
        if (req == null) return null;

        // Create a new entity that represents a DM conversation row in the DB.
        DirectConversation conv = new DirectConversation();
        conv.setId(UUID.randomUUID());

        // Copy over who created it. We trust the request for this ID (service can validate).
        conv.setCreatedByUserId(req.getCreatedByUserId());

        // Whether it’s a group or 1:1 chat comes directly from the request.
        conv.setGroup(req.isGroup());

        // Optional title for the conversation (especially for groups).
        conv.setTitle(req.getTitle());

        // Mark the creation time as "now".
        // (If you need deterministic testing, consider injecting a Clock instead.)
        conv.setCreatedAt(LocalDateTime.now());

        return conv;
    }

    // ----------------- Request DTO -> Entity (DirectParticipant) -----------------
    public DirectParticipant toParticipant(UUID conversationId, DmParticipantRequest req) {
        if (req == null || conversationId == null) return null;

        // Create a participant entity for a given conversation.
        DirectParticipant participant = new DirectParticipant();
        participant.setId(UUID.randomUUID());

        // Link this participant to the conversation.
        participant.setDirectConversationId(conversationId);

        // Which user is joining.
        participant.setUserId(req.getUserId());

        // Mark the join time as "now".
        // (If you need deterministic testing, consider injecting a Clock instead.)
        participant.setJoinedAt(LocalDateTime.now());
        participant.setLeftAt(null); // Still active

        // Null-safe boolean: if admin is TRUE, set true; otherwise false.
        // Using Boolean.TRUE.equals(...) avoids NullPointerException and treats null as false.
        participant.setAdmin(req.getAdmin() != null ? req.getAdmin() : false);

        // If notifyLevel is not provided, default to ALL to avoid nulls downstream.
        participant.setNotifyLevel(
            req.getNotifyLevel() != null ? req.getNotifyLevel() : DirectParticipant.NotifyLevel.ALL
        );

        return participant;
    }

    // ----------------- Entity -> Response DTO (single conversation + its participants) -----------------
    public DmResponse toResponse(DirectConversation conv, List<DirectParticipant> participants) {
        if (conv == null) return null;

        // Prepare the response DTO the API will return to clients.
        DmResponse response = new DmResponse();

        // Copy top-level conversation fields.
        response.setId(conv.getId());
        response.setCreatedByUserId(conv.getCreatedByUserId());
        response.setTitle(conv.getTitle());
        response.setGroup(conv.isGroup());
        response.setCreatedAt(conv.getCreatedAt()); // assumed to be set by entity at persist-time

        if (participants != null) {
            // Convert each DirectParticipant entity to the nested DmResponse.Participant DTO.
            response.setParticipants(participants.stream()
                .map(this::toParticipantResponse)
                .collect(Collectors.toList()));
        }

        // Return the final response DTO ready to be serialized to JSON.
        return response;
    }

    // ----------------- Entities -> Response DTOs (list of conversations) -----------------
    public List<DmResponse> toResponses(List<DirectConversation> conversations, 
                                       Function<UUID, List<DirectParticipant>> participantLoader) {
        if (conversations == null) return null;

        // This method maps a list of conversations to a list of response DTOs.
        // It accepts a participantLoader function that, given a conversationId,
        // returns that conversation’s participants. This keeps the mapper generic
        // and lets the service decide how to fetch (in-memory, repo call, cached, etc.).

        return conversations.stream()
            // For each conversation, load its participants (using the provided function)
            // and convert to a DmResponse via the single-item mapper above.
            .map(conv -> toResponse(conv, participantLoader.apply(conv.getId())))
            .collect(Collectors.toList());
    }

    private DmResponse.ParticipantInfo toParticipantResponse(DirectParticipant participant) {
        if (participant == null) return null;

        DmResponse.ParticipantInfo info = new DmResponse.ParticipantInfo();
        info.setUserId(participant.getUserId());
        info.setJoinedAt(participant.getJoinedAt());
        info.setLeftAt(participant.getLeftAt());
        info.setAdmin(participant.isAdmin());
        info.setNotifyLevel(participant.getNotifyLevel());

        return info;
    }
}