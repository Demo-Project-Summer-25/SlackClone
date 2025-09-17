package com.hire_me.Ping.bots.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.hire_me.Ping.users.entity.User;

@Entity
@Table(name = "bot_integrations")
public class BotIntegration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    @Size(min = 3, max = 50, message = "Bot name must be between 3 and 50 characters")
    @NotBlank(message = "Bot name cannot be blank")
    private String name;

    @Column(length = 500)
    @Size(max = 500, message = "Description should not exceed 500 characters")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BotType botType;

    @Column(nullable = false)
    @NotBlank(message = "API key cannot be blank")
    private String apiKey;

    @Column(columnDefinition = "TEXT")
    private String configuration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(updatable = false)
    @Enumerated(EnumType.STRING)
    private BotStatus status = BotStatus.ACTIVE;

    @Column
    @CreationTimestamp
    private LocalDateTime createdTimestamp;

    @Column
    @UpdateTimestamp
    private LocalDateTime updatedTimestamp;

    public BotIntegration() {}

    public BotIntegration( String name, String description, BotType botType, String apiKey, User user) {
        this.name = name;
        this.description = description;
        this.botType = botType;
        this.apiKey = apiKey;
        this.user = user;
        this.status = BotStatus.ACTIVE;
    }

    public enum BotType {
        CLAUDE_SONNET,
        CLAUDE_HAIKU,
        CLAUDE_OPUS,
        CUSTOM
    }

    public enum BotStatus {
        ACTIVE,
        INACTIVE,
        ERROR,
        SUSPENDED
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BotStatus getStatus() { return status; }
    public void setStatus(BotStatus status) { this.status = status; }

    public LocalDateTime getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(LocalDateTime createdTimestamp) { this.createdTimestamp = createdTimestamp; }

    public LocalDateTime getUpdatedTimestamp() { return updatedTimestamp; }
    public void setUpdatedTimestamp(LocalDateTime updatedTimestamp) { this.updatedTimestamp = updatedTimestamp; }
}
