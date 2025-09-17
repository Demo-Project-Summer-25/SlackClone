package com.hire_me.Ping.users.service;

import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;
import com.hire_me.Ping.users.entity.User;
import com.hire_me.Ping.users.repo.UserRepository;
import com.hire_me.Ping.users.dto.UserPublicDto;
import com.hire_me.Ping.users.dto.UserUpdateRequest;
import com.hire_me.Ping.users.mapper.UserMapper;

@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserPublicDto getUserById(UUID id) {
        return userRepository.findById(id)
                .map(UserMapper::toPublicDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserPublicDto> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(UserMapper::toPublicDto)
            .collect(Collectors.toList());
    }

    public UserPublicDto updateUser(UUID id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserMapper.updateUserFromRequest(user, updateRequest);
        
        User updatedUser = userRepository.save(user);
        return UserMapper.toPublicDto(updatedUser);
    }
}
