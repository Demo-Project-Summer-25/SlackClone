package com.hire_me.Ping.bots.dto;

import jakarta.validation.constraints.Size;
import com.hire_me.Ping.bots.entity.BotIntegration.BotType;
import com.hire_me.Ping.bots.entity.BotIntegration.BotStatus;

public class BotUpdateRequest {
    
    @Size(min = 1, max = 100, message = "Bot name must be between 1 and 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    private BotType botType;
    
    private String apiKey;
    
    private String configuration;
    
    private BotStatus status;
    
    public BotUpdateRequest() {}
    
    public BotUpdateRequest(String name, String description, BotType botType, 
                           String apiKey, String configuration, BotStatus status) {
        this.name = name;
        this.description = description;
        this.botType = botType;
        this.apiKey = apiKey;
        this.configuration = configuration;
        this.status = status;
    }
    
   
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BotType getBotType() { return botType; }
    public void setBotType(BotType botType) { this.botType = botType; }
    
    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }
    
    public String getConfiguration() { return configuration; }
    public void setConfiguration(String configuration) { this.configuration = configuration; }
    
    public BotStatus getStatus() { return status; }
    public void setStatus(BotStatus status) { this.status = status; }
}
