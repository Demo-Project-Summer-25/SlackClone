package com.hire_me.Ping.channels.dto;

import com.hire_me.Ping.users.dto.UserPublicDto;
import java.time.Instant;
import java.util.UUID;

public class ChannelResponse {
    private UUID id;
    private String name;
    private String description;
    private boolean isPublic;
    private UserPublicDto createdBy;
    private Instant createdAt;

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public UserPublicDto getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserPublicDto createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}