package com.hire_me.Ping.dms.mapper;

import com.hire_me.Ping.dms.dto.DmCreateRequest;
import com.hire_me.Ping.dms.dto.DmParticipantRequest;
import com.hire_me.Ping.dms.dto.DmResponse;
import com.hire_me.Ping.dms.entity.DirectConversation;
import com.hire_me.Ping.dms.entity.DirectParticipant;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

// This class contains pure conversion methods.
// It should be stateless: no fields, just functions that take input objects and
// produce output objects.

public class DmMapper {

    // ----------------- Request DTO -> Entity (DirectConversation) -----------------
    public DirectConversation toConversation(DmCreateRequest req) {
        // Create a new entity that represents a DM conversation row in the DB.
        DirectConversation dc = new DirectConversation();

        // Copy over who created it. We trust the request for this ID (service can validate).
        dc.setCreatedByUserId(req.getCreatedByUserId());

        // Whether it’s a group or 1:1 chat comes directly from the request.
        dc.setGroup(req.isGroup());

        // Optional title for the conversation (especially for groups).
        dc.setTitle(req.getTitle());

        // NOTE: we do NOT set createdAt here. We rely on the entity to default it
        // (e.g., in the entity constructor or with @PrePersist).
        // This keeps "time source" logic in one place.
        return dc;
    }

    // ----------------- Request DTO -> Entity (DirectParticipant) -----------------
    public DirectParticipant toParticipant(Long conversationId, DmParticipantRequest req) {
        // Create a participant entity for a given conversation.
        DirectParticipant dp = new DirectParticipant();

        // Link this participant to the conversation.
        dp.setConversationId(conversationId);

        // Which user is joining.
        dp.setUserId(req.getUserId());

        // Null-safe boolean: if admin is TRUE, set true; otherwise false.
        // Using Boolean.TRUE.equals(...) avoids NullPointerException and treats null as false.
        dp.setAdmin(Boolean.TRUE.equals(req.getAdmin()));

        // If notifyLevel is not provided, default to ALL to avoid nulls downstream.
        dp.setNotifyLevel(
            req.getNotifyLevel() != null ? req.getNotifyLevel() : DirectParticipant.NotifyLevel.ALL
        );

        // Mark the join time as "now".
        // (If you need deterministic testing, consider injecting a Clock instead.)
        dp.setJoinedAt(Instant.now());

        return dp;
    }

    // ----------------- Entity -> Response DTO (single conversation + its participants) -----------------
    public DmResponse toResponse(DirectConversation c, List<DirectParticipant> participants) {
        // Prepare the response DTO the API will return to clients.
        DmResponse res = new DmResponse();

        // Copy top-level conversation fields.
        res.setId(c.getId());
        res.setCreatedByUserId(c.getCreatedByUserId());
        res.setGroup(c.isGroup());
        res.setTitle(c.getTitle());
        res.setCreatedAt(c.getCreatedAt()); // assumed to be set by entity at persist-time

        // Convert each DirectParticipant entity to the nested DmResponse.Participant DTO.
        List<DmResponse.Participant> items = new ArrayList<>();
        for (DirectParticipant dp : participants) {
            DmResponse.Participant p = new DmResponse.Participant();

            // Basic identity + role.
            p.setUserId(dp.getUserId());
            p.setAdmin(dp.isAdmin());

            // Timestamps for when they joined/left.
            p.setJoinedAt(dp.getJoinedAt());
            p.setLeftAt(dp.getLeftAt()); // may be null if they’re still in the DM

            // Notification preference for this DM.
            p.setNotifyLevel(dp.getNotifyLevel());

            // Add to the list we’ll place on the response.
            items.add(p);
        }

        // Attach all converted participants to the response.
        res.setParticipants(items);

        // Return the final response DTO ready to be serialized to JSON.
        return res;
    }

    // ----------------- Entities -> Response DTOs (list of conversations) -----------------
    public List<DmResponse> toResponses(
        List<DirectConversation> conversations,
        java.util.function.Function<Long, List<DirectParticipant>> participantLoader
    ) {
        // This method maps a list of conversations to a list of response DTOs.
        // It accepts a participantLoader function that, given a conversationId,
        // returns that conversation’s participants. This keeps the mapper generic
        // and lets the service decide how to fetch (in-memory, repo call, cached, etc.).

        List<DmResponse> out = new ArrayList<>();

        for (DirectConversation c : conversations) {
            // For each conversation, load its participants (using the provided function)
            // and convert to a DmResponse via the single-item mapper above.
            out.add(toResponse(c, participantLoader.apply(c.getId())));
        }

        // Return the full list of mapped responses.
        return out;
    }
}