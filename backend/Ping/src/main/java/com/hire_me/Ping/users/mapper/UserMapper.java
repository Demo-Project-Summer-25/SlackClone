package com.hire_me.Ping.users.mapper;

import com.hire_me.Ping.users.entity.User;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import com.hire_me.Ping.users.dto.UserPublicDto;
import com.hire_me.Ping.users.dto.UserUpdateRequest;
@Component
public class UserMapper {
    public static UserPublicDto toPublicDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserPublicDto(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getProfileUrl(),
                user.getCreatedTimestamp(),
                user.getAccountStatus()
        );
    }

    public static void updateUserFromRequest (User user, UserUpdateRequest request) {
        if (isValidString(request.getDisplayName())) {
            user.setDisplayName(request.getDisplayName());
        }
        if (isValidString(request.getProfileUrl())) {
            user.setProfileUrl(request.getProfileUrl());
        }
        if (isValidString(request.getEmail())) {
            user.setEmail(request.getEmail());
        }
    }
    
    private static boolean isValidString(String str) {
        return str != null && !str.trim().isEmpty();
    }
}
