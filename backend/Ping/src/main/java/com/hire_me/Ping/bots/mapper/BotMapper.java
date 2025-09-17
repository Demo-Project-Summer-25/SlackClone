package com.hire_me.Ping.bots.mapper;

import com.hire_me.Ping.bots.entity.BotIntegration;
import com.hire_me.Ping.bots.dto.BotIntegrationPublicDto;
import com.hire_me.Ping.bots.dto.BotCreateRequest;
import com.hire_me.Ping.bots.dto.BotUpdateRequest;
import com.hire_me.Ping.users.entity.User;

public class BotMapper {
    
    
    public static BotIntegrationPublicDto toPublicDto(BotIntegration bot) {
        if (bot == null) {
            return null;
        }
        return new BotIntegrationPublicDto(
            bot.getId(),
            bot.getName(),
            bot.getDescription(),
            bot.getBotType(),
            bot.getStatus(),
            bot.getUser().getId(), 
            bot.getCreatedTimestamp(),
            bot.getUpdatedTimestamp()
        );
    }
    
    
    public static BotIntegration toEntity(BotCreateRequest request, User user) {
        if (request == null || user == null) {
            return null;
        }
        return new BotIntegration(
            request.getName(),
            request.getDescription(),
            request.getBotType(),
            request.getApiKey(),
            user
        );
    }
    
    
    public static void updateBotFromRequest(BotIntegration bot, BotUpdateRequest request) {
        if (bot == null || request == null) {
            return;
        }
        
        if (isValidString(request.getName())) {
            bot.setName(request.getName());
        }
        if (request.getDescription() != null) {
            bot.setDescription(request.getDescription());
        }
        if (request.getBotType() != null) {
            bot.setBotType(request.getBotType());
        }
        if (isValidString(request.getApiKey())) {
            bot.setApiKey(request.getApiKey());
        }
        if (request.getConfiguration() != null) {
            bot.setConfiguration(request.getConfiguration());
        }
        if (request.getStatus() != null) {
            bot.setStatus(request.getStatus());
        }
    }
    
    private static boolean isValidString(String str) {
        return str != null && !str.trim().isEmpty();
    }
}
