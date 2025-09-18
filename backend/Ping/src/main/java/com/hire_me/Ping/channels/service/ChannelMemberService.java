package com.hire_me.Ping.channels.service;

import com.hire_me.Ping.channels.dto.ChannelMemberRequest;
import com.hire_me.Ping.channels.dto.ChannelMemberResponse;
import com.hire_me.Ping.channels.entity.Channel;
import com.hire_me.Ping.channels.entity.ChannelMember;
import com.hire_me.Ping.channels.mapper.ChannelMapper;
import com.hire_me.Ping.channels.repository.ChannelMemberRepository;
import com.hire_me.Ping.users.entity.User;
import com.hire_me.Ping.users.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChannelMemberService {

    private final ChannelMemberRepository memberRepository;
    private final ChannelService channelService;
    private final UserRepository userService;
    private final ChannelMapper channelMapper = ChannelMapper.INSTANCE;

    public ChannelMemberService(ChannelMemberRepository memberRepository, ChannelService channelService,
            UserRepository userService) {
        this.memberRepository = memberRepository;
        this.channelService = channelService;
        this.userService = userService;
    }

    public List<ChannelMemberResponse> getChannelMembers(Long channelId) {
        List<ChannelMember> members = memberRepository.findAllByChannelId(channelId);
        return channelMapper.membersToResponseList(members);
    }

    @Transactional
    public ChannelMemberResponse addMember(Long channelId, ChannelMemberRequest request, UUID requesterId) {
        checkManagerPermissions(channelId, requesterId);

        if (memberRepository.findByChannelIdAndUserId(channelId, request.getUserId()).isPresent()) {
            throw new RuntimeException("User is already a member of this channel.");
        }

        Channel channel = channelService.findChannelById(channelId);
        User userToAdd = userService.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChannelMember newMember = new ChannelMember(channel, userToAdd, request.getRole());

        ChannelMember savedMember = memberRepository.save(newMember);
        return channelMapper.memberToResponse(savedMember);
    }

    @Transactional
    public void removeMember(Long channelId, UUID memberUserId, UUID requesterId) {
        checkManagerPermissions(channelId, requesterId);
        memberRepository.deleteByChannelIdAndUserId(channelId, memberUserId);
    }

    private void checkManagerPermissions(Long channelId, UUID requesterId) {
        ChannelMember requesterMembership = memberRepository.findByChannelIdAndUserId(channelId, requesterId)
                .orElseThrow(() -> new RuntimeException("Requester is not a member of the channel."));

        if (!requesterMembership.isManager()) {
            throw new RuntimeException("You do not have permission to manage members.");
        }
    }
}