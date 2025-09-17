package com.hire_me.Ping.channels.mapper;

import com.hire_me.Ping.channels.dto.*;
import com.hire_me.Ping.channels.entity.Channel;
import com.hire_me.Ping.channels.entity.ChannelMember;
import com.hire_me.Ping.users.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(
    uses = {UserMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ChannelMapper {

    ChannelMapper INSTANCE = Mappers.getMapper(ChannelMapper.class);

    Channel toEntity(ChannelCreateRequest dto);

    ChannelResponse toResponse(Channel channel);

    void updateFromDto(ChannelUpdateRequest dto, @MappingTarget Channel entity);

    @Mapping(source = "user", target = "user")
    ChannelMemberResponse memberToResponse(ChannelMember channelMember);

    List<ChannelMemberResponse> membersToResponseList(List<ChannelMember> members);
}