package com.hire_me.Ping.bots.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.hire_me.Ping.bots.entity.BotIntegration.BotType;

public class BotCreateRequest {

    @NotBlank(message = "Bot name cannot be blank")
    @Size(min = 3, max = 50, message = "Bot name must be between 3 and 50 characters")
    private String name;

    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;

    @NotNull(message = "Bot type must be specified")
    private BotType botType;

    @NotBlank(message = "API key cannot be blank")
    private String apiKey;

    private String configuration;

    public BotCreateRequest() {}

    public BotCreateRequest(String name, String description, BotType botType, String apiKey, String configuration) {
        this.name = name;
        this.description = description;
        this.botType = botType;
        this.apiKey = apiKey;
        this.configuration = configuration;
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
}
