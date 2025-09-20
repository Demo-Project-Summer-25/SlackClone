package com.hire_me.Ping.channels.service;

import com.hire_me.Ping.channels.dto.ChannelCreateRequest;
import com.hire_me.Ping.channels.dto.ChannelResponse;
import com.hire_me.Ping.channels.dto.ChannelUpdateRequest;
import com.hire_me.Ping.channels.entity.Channel;
import com.hire_me.Ping.channels.entity.ChannelMember;
import com.hire_me.Ping.channels.mapper.ChannelMapper;
import com.hire_me.Ping.channels.repository.ChannelRepository;
import com.hire_me.Ping.users.entity.User;
import com.hire_me.Ping.users.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final UserRepository userService;
    private final ChannelMapper channelMapper = ChannelMapper.INSTANCE;

    @Autowired
    public ChannelService(ChannelRepository channelRepository, UserRepository userService) {
        this.channelRepository = channelRepository;
        this.userService = userService;
    }

    @Transactional
    public ChannelResponse createChannel(ChannelCreateRequest createRequest, UUID ownerId) {
        User owner = userService.findById(ownerId).get(); 
        
        Channel channel = channelMapper.toEntity(createRequest);
        channel.setCreatedBy(owner);

        ChannelMember ownerAsMember = new ChannelMember(channel, owner, ChannelMember.Role.ADMIN);
        channel.addMember(ownerAsMember);

        Channel savedChannel = channelRepository.save(channel);
        return channelMapper.toResponse(savedChannel);
    }

    public ChannelResponse getChannelResponseById(UUID channelId) {
        return channelRepository.findById(channelId)
                .map(channelMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Channel not found with id: " + channelId));
    }

    @Transactional
    public ChannelResponse updateChannel(UUID channelId, ChannelUpdateRequest updateRequest) {
        Channel channel = findChannelById(channelId);
        // TODO: Add authorization logic
        
        channelMapper.updateFromDto(updateRequest, channel);
        Channel updatedChannel = channelRepository.save(channel);
        return channelMapper.toResponse(updatedChannel);
    }

    @Transactional
    public void deleteChannel(UUID channelId) {
        // TODO: Add authorization logic
        if (!channelRepository.existsById(channelId)) {
            throw new RuntimeException("Channel not found with id: " + channelId);
        }
        channelRepository.deleteById(channelId);
    }

    public Channel findChannelById(UUID channelId) {
        return channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found with id: " + channelId));
    }

     public List<Channel> getChannelsForUser(UUID userId) {
        return channelRepository.findByMembersUserId(userId);
    }

    public List<ChannelResponse> getUserChannels(UUID userId) {
    List<Channel> channels = channelRepository.findChannelsByUserIdWithCreator(userId);

    return channels.stream()
        .map(ChannelMapper.INSTANCE::toResponse)
        .toList();
}


}