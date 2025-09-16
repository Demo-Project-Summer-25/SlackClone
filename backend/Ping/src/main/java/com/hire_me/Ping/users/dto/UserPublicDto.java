package com.hire_me.Ping.users.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.hire_me.Ping.users.entity.User.AccountStatus;

public class UserPublicDto {
    public UUID id;
    public String username;
    public String displayName;
    public String profileUrl;
    private LocalDateTime createdTimestamp;
    private AccountStatus accountStatus;

    public UserPublicDto() {}

    public UserPublicDto(UUID id, String username, String displayName, String profileUrl, LocalDateTime createdTimestamp, AccountStatus accountStatus) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.profileUrl = profileUrl;
        this.createdTimestamp = createdTimestamp;
        this.accountStatus = accountStatus;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getProfileUrl() { return profileUrl; }
    public void setProfileUrl(String profileUrl) { this.profileUrl = profileUrl; }

    public LocalDateTime getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(LocalDateTime createdTimestamp) { this.createdTimestamp = createdTimestamp; }

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }
}
