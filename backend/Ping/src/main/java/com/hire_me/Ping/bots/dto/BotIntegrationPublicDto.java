package com.hire_me.Ping.bots.dto;

import java.util.UUID;
import java.time.LocalDateTime;
import com.hire_me.Ping.bots.entity.BotIntegration.BotStatus;
import com.hire_me.Ping.bots.entity.BotIntegration.BotType;

public class BotIntegrationPublicDto {
    private UUID id;
    private String name;
    private String description;
    private BotType botType;
    private BotStatus status;
    private UUID userId;
    private LocalDateTime createdTimestamp;
    private LocalDateTime updatedTimestamp;

    public BotIntegrationPublicDto() {}

    public BotIntegrationPublicDto(UUID id, String name, String description, 
                                    BotType botType, BotStatus status, UUID userId, 
                                    LocalDateTime createdTimestamp, LocalDateTime updatedTimestamp) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.botType = botType;
        this.status = status;
        this.userId = userId;
        this.createdTimestamp = createdTimestamp;
        this.updatedTimestamp = updatedTimestamp;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BotType getBotType() { return botType; }
    public void setBotType(BotType botType) { this.botType = botType; }

    public BotStatus getStatus() { return status; }
    public void setStatus(BotStatus status) { this.status = status; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public LocalDateTime getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(LocalDateTime createdTimestamp) { this.createdTimestamp = createdTimestamp; }

    public LocalDateTime getUpdatedTimestamp() { return updatedTimestamp; }
    public void setUpdatedTimestamp(LocalDateTime updatedTimestamp) { this.updatedTimestamp = updatedTimestamp; }

}
