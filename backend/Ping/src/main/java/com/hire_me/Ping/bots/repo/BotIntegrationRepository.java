package com.hire_me.Ping.bots.repo;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hire_me.Ping.bots.entity.BotIntegration;
import com.hire_me.Ping.bots.entity.BotIntegration.BotStatus;
import com.hire_me.Ping.bots.entity.BotIntegration.BotType;

public interface BotIntegrationRepository extends JpaRepository<BotIntegration, UUID> {
    List<BotIntegration> findByUserId(UUID userId);
    List<BotIntegration> findByUserIdAndStatus(UUID userId, BotStatus status);
    List<BotIntegration> findByBotType(BotType botType);
    Optional<BotIntegration> findByNameAndUserId(String name, UUID userId);
    boolean existsByNameAndUserId(String name, UUID userId);
    long countByUserId(UUID userId);
    List<BotIntegration> findByStatus(BotStatus status);
}
