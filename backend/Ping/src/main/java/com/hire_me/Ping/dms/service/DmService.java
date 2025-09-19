package com.hire_me.Ping.dms.service;

import com.hire_me.Ping.dms.dto.DmCreateRequest;
import com.hire_me.Ping.dms.dto.DmParticipantRequest;
import com.hire_me.Ping.dms.dto.DmResponse;
import com.hire_me.Ping.dms.entity.DirectConversation;
import com.hire_me.Ping.dms.entity.DirectParticipant;
import com.hire_me.Ping.dms.mapper.DmMapper;
import com.hire_me.Ping.dms.repo.DirectConversationRepository;
import com.hire_me.Ping.dms.repo.DirectParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;  // Changed from LocalDateTime
import java.util.*;

@Service
public class DmService {
    private final DirectConversationRepository conversationRepo;
    private final DirectParticipantRepository participantRepo;
    private final DmMapper mapper;

    public DmService(DirectConversationRepository conversationRepo, DirectParticipantRepository participantRepo, DmMapper mapper) {
        this.conversationRepo = conversationRepo;
        this.participantRepo = participantRepo;
        this.mapper = mapper;
    }

    @Transactional
    public DmResponse create(DmCreateRequest req) {
        if (req.getCreatedByUserId() == null) {
            throw new IllegalArgumentException("createdByUserId is required");
        }

        DirectConversation conv = mapper.toConversation(req);
        conv = conversationRepo.save(conv);

        // Ensure creator is present in the participant list as admin by default
        Map<UUID, DmParticipantRequest> byUser = new LinkedHashMap<>();
        if (req.getParticipants() != null) {
            for (DmParticipantRequest p : req.getParticipants()) {
                if (p.getUserId() != null) {
                    byUser.put(p.getUserId(), p);
                }
            }
        }
        byUser.putIfAbsent(req.getCreatedByUserId(), creatorAdmin(req));

        // For 1:1, ensure exactly two distinct users
        if (!req.isGroup() && byUser.size() != 2) {
            throw new IllegalArgumentException("1:1 DM must include exactly 2 distinct users (including creator)");
        }

        List<DirectParticipant> parts = new ArrayList<>();
        for (DmParticipantRequest p : byUser.values()) {
            DirectParticipant dp = mapper.toParticipant(conv.getId(), p);
            parts.add(dp);
        }
        participantRepo.saveAll(parts);

        List<DirectParticipant> saved = participantRepo.findByDirectConversationId(conv.getId());
        return mapper.toResponse(conv, saved);
    }

    private DmParticipantRequest creatorAdmin(DmCreateRequest req) {
        DmParticipantRequest creator = new DmParticipantRequest();
        creator.setUserId(req.getCreatedByUserId());
        creator.setAdmin(Boolean.TRUE);
        return creator;
    }

    @Transactional(readOnly = true)
    public DmResponse get(UUID conversationId) {
        DirectConversation conv = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("DM not found: " + conversationId));
        List<DirectParticipant> parts = participantRepo.findByDirectConversationId(conversationId);
        return mapper.toResponse(conv, parts);
    }

    @Transactional(readOnly = true)
    public List<DmResponse> listForUser(UUID userId) {
        List<UUID> ids = conversationRepo.findActiveConversationIdsByUser(userId);
        if (ids.isEmpty()) return Collections.emptyList();
        List<DirectConversation> convs = conversationRepo.findAllByIds(ids);
        return mapper.toResponses(convs, participantRepo::findByDirectConversationId);
    }

    @Transactional
    public DmResponse addParticipant(UUID conversationId, DmParticipantRequest req) {
        if (req.getUserId() == null) throw new IllegalArgumentException("userId is required");

        DirectConversation conv = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("DM not found: " + conversationId));

        if (participantRepo.existsByDirectConversationIdAndUserId(conversationId, req.getUserId())) {
            // already present (possibly previously left) -> rejoin if left
            Optional<DirectParticipant> existing = participantRepo.findByDirectConversationIdAndUserIdAndLeftAtIsNull(conversationId, req.getUserId());
            if (existing.isPresent()) {
                // No-op, still inside
            } else {
                DirectParticipant rejoin = mapper.toParticipant(conversationId, req);
                rejoin.setJoinedAt(Instant.now());  // Changed from LocalDateTime.now()
                rejoin.setLeftAt(null);
                participantRepo.save(rejoin);
            }
        } else {
            participantRepo.save(mapper.toParticipant(conversationId, req));
        }

        List<DirectParticipant> parts = participantRepo.findByDirectConversationId(conversationId);
        return mapper.toResponse(conv, parts);
    }

    @Transactional
    public DmResponse removeParticipant(UUID conversationId, UUID userId) {
        DirectConversation conv = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("DM not found: " + conversationId));
        participantRepo.findByDirectConversationIdAndUserIdAndLeftAtIsNull(conversationId, userId)
                .ifPresent(p -> participantRepo.softLeave(p, Instant.now()));  // Changed from LocalDateTime.now()

        List<DirectParticipant> parts = participantRepo.findByDirectConversationId(conversationId);
        return mapper.toResponse(conv, parts);
    }
}

