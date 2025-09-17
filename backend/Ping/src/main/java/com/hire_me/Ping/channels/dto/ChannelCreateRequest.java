package com.hire_me.Ping.channels.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ChannelCreateRequest {

    @NotBlank(message = "Channel name cannot be blank")
    @Size(min = 3, max = 100)
    private String name;

    @Size(max = 255)
    private String description;

    @NotNull
    private Boolean isPublic = true;

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