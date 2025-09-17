package com.hire_me.Ping.bots.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.hire_me.Ping.bots.entity.BotIntegration;
import com.hire_me.Ping.bots.entity.BotIntegration.BotStatus;
import com.hire_me.Ping.bots.repo.BotIntegrationRepository;
import com.hire_me.Ping.bots.dto.BotIntegrationPublicDto;
import com.hire_me.Ping.bots.dto.BotCreateRequest;
import com.hire_me.Ping.bots.dto.BotUpdateRequest;
import com.hire_me.Ping.bots.mapper.BotMapper;
import com.hire_me.Ping.users.entity.User;
import com.hire_me.Ping.users.repo.UserRepository;

@Service
public class BotService {
    private final BotIntegrationRepository botRepository;
    private final UserRepository userRepository;
    
    public BotService(BotIntegrationRepository botRepository, UserRepository userRepository) {
        this.botRepository = botRepository;
        this.userRepository = userRepository;
    }
    
    
    public BotIntegrationPublicDto createBot(UUID userId, BotCreateRequest request) {
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (botRepository.existsByNameAndUserId(request.getName(), userId)) {
            throw new RuntimeException("Bot name already exists for this user");
        }
        

        BotIntegration bot = BotMapper.toEntity(request, user);
        bot.setConfiguration(request.getConfiguration()); 
        

        BotIntegration savedBot = botRepository.save(bot);
        return BotMapper.toPublicDto(savedBot);
    }
    
 
    public BotIntegrationPublicDto getBotById(UUID botId) {
        return botRepository.findById(botId)
            .map(BotMapper::toPublicDto)
            .orElseThrow(() -> new RuntimeException("Bot not found"));
    }
    
   
    public List<BotIntegrationPublicDto> getUserBots(UUID userId) {
        return botRepository.findByUserId(userId)
            .stream()
            .map(BotMapper::toPublicDto)
            .collect(Collectors.toList());
    }
    
  
    public List<BotIntegrationPublicDto> getUserActiveBots(UUID userId) {
        return botRepository.findByUserIdAndStatus(userId, BotStatus.ACTIVE)
            .stream()
            .map(BotMapper::toPublicDto)
            .collect(Collectors.toList());
    }
    

    public BotIntegrationPublicDto updateBot(UUID botId, BotUpdateRequest request) {
        BotIntegration bot = botRepository.findById(botId)
            .orElseThrow(() -> new RuntimeException("Bot not found"));
        
        BotMapper.updateBotFromRequest(bot, request);
        
        BotIntegration updatedBot = botRepository.save(bot);
        return BotMapper.toPublicDto(updatedBot);
    }
    
  
    public void deleteBot(UUID botId) {
        if (!botRepository.existsById(botId)) {
            throw new RuntimeException("Bot not found");
        }
        botRepository.deleteById(botId);
    }
    
  
    public long getUserBotCount(UUID userId) {
        return botRepository.countByUserId(userId);
    }
}
