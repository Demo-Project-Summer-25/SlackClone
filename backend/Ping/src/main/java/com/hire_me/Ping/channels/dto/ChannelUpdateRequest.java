package com.hire_me.Ping.channels.dto;

import jakarta.validation.constraints.Size;

public class ChannelUpdateRequest {

    @Size(min = 3, max = 100)
    private String name;

    @Size(max = 255)
    private String description;

    private Boolean isPublic;

    // Getters and Setters
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

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
}