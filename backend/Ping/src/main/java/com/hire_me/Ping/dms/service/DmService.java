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

import java.time.Instant;
import java.util.*;

@Service
public class DmService {
    private final DirectConversationRepository conversationRepo;
    private final DirectParticipantRepository participantRepo;
    private final DmMapper mapper = new DmMapper();

    public DmService(DirectConversationRepository conversationRepo, DirectParticipantRepository participantRepo) {
        this.conversationRepo = conversationRepo;
        this.participantRepo = participantRepo;
    }

    @Transactional
    public DmResponse create(DmCreateRequest req) {
        if (req.getCreatedByUserId() == null) {
            throw new IllegalArgumentException("createdByUserId is required");
        }

        DirectConversation conv = mapper.toConversation(req);
        conv = conversationRepo.save(conv);

        // Ensure creator is present in the participant list as admin by default
        Map<Long, DmParticipantRequest> byUser = new LinkedHashMap<>();
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

        List<DirectParticipant> saved = participantRepo.findByConversationId(conv.getId());
        return mapper.toResponse(conv, saved);
    }

    private DmParticipantRequest creatorAdmin(DmCreateRequest req) {
        DmParticipantRequest creator = new DmParticipantRequest();
        creator.setUserId(req.getCreatedByUserId());
        creator.setAdmin(Boolean.TRUE); // creator is admin by default
        return creator;
    }

    @Transactional(readOnly = true)
    public DmResponse get(Long conversationId) {
        DirectConversation conv = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("DM not found: " + conversationId));
        List<DirectParticipant> parts = participantRepo.findByConversationId(conversationId);
        return mapper.toResponse(conv, parts);
    }

    @Transactional(readOnly = true)
    public List<DmResponse> listForUser(Long userId) {
        List<Long> ids = conversationRepo.findActiveConversationIdsByUser(userId);
        if (ids.isEmpty()) return Collections.emptyList();
        List<DirectConversation> convs = conversationRepo.findAllByIds(ids);
        return mapper.toResponses(convs, participantRepo::findByConversationId);
    }

    @Transactional
    public DmResponse addParticipant(Long conversationId, DmParticipantRequest req) {
        if (req.getUserId() == null) throw new IllegalArgumentException("userId is required");

        DirectConversation conv = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("DM not found: " + conversationId));

        if (participantRepo.existsByConversationIdAndUserId(conversationId, req.getUserId())) {
            // already present (possibly previously left) -> rejoin if left
            Optional<DirectParticipant> existing = participantRepo.findByConversationIdAndUserIdAndLeftAtIsNull(conversationId, req.getUserId());
            if (existing.isPresent()) {
                // No-op, still inside
            } else {
                DirectParticipant rejoin = mapper.toParticipant(conversationId, req);
                rejoin.setJoinedAt(Instant.now());
                rejoin.setLeftAt(null);
                participantRepo.save(rejoin);
            }
        } else {
            participantRepo.save(mapper.toParticipant(conversationId, req));
        }

        List<DirectParticipant> parts = participantRepo.findByConversationId(conversationId);
        return mapper.toResponse(conv, parts);
    }

    @Transactional
    public DmResponse removeParticipant(Long conversationId, Long userId) {
        DirectConversation conv = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new NoSuchElementException("DM not found: " + conversationId));
        participantRepo.findByConversationIdAndUserIdAndLeftAtIsNull(conversationId, userId)
                .ifPresent(p -> participantRepo.softLeave(p, Instant.now()));

        List<DirectParticipant> parts = participantRepo.findByConversationId(conversationId);
        return mapper.toResponse(conv, parts);
    }
}

