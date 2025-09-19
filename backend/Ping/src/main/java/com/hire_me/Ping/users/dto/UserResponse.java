package com.hire_me.Ping.users.dto;

import com.hire_me.Ping.users.entity.User;

import java.time.Instant;
import java.util.UUID;

public class UserResponse {
    // This represents user information that we send to clients
    // It excludes sensitive fields and includes display-friendly data

    private UUID id;
    // The user's unique identifier

    private String username;
    // Their login username

    private String displayName;
    // Their display name (what others see)

    private String email;
    // Their email address

    private String profileUrl;
    // URL to their profile picture

    private User.AccountStatus accountStatus;
    // Whether their account is ACTIVE, SUSPENDED, etc.

    private Instant createdTimestamp;
    // When they created their account

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProfileUrl() { return profileUrl; }
    public void setProfileUrl(String profileUrl) { this.profileUrl = profileUrl; }

    public User.AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(User.AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public Instant getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(Instant createdTimestamp) { this.createdTimestamp = createdTimestamp; }
}