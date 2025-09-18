package com.hire_me.Ping.channels.dto;

import com.hire_me.Ping.channels.entity.ChannelMember.Role;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ChannelMemberRequest {

    @NotNull
    private UUID userId;

    @NotNull
    private Role role;

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}