package com.hire_me.Ping.channels.dto;

import com.hire_me.Ping.channels.entity.ChannelMember.Role;
import com.hire_me.Ping.users.dto.UserPublicDto;
import java.time.Instant;
import java.util.UUID;

public class ChannelMemberResponse {
    private UUID id;
    private UserPublicDto user;
    private Role role;
    private Instant joinedAt;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserPublicDto getUser() {
        return user;
    }

    public void setUser(UserPublicDto user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }
}