package com.hire_me.Ping.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;

public class UserUpdateRequest {
   

    @Size(min = 3, max = 50, message = "Display name should not exceed 50 characters")
    @NotBlank(message = "Cannot be blank")
    private String displayName;

    private String profileUrl;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Cannot be blank")
    private String email;

    public UserUpdateRequest() {}

    public UserUpdateRequest(String displayName, String profileUrl, String email) {
        this.displayName = displayName;
        this.profileUrl = profileUrl;
        this.email = email;
    }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getProfileUrl() { return profileUrl; }
    public void setProfileUrl(String profileUrl) { this.profileUrl = profileUrl; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
