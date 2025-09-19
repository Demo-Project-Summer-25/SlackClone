package com.hire_me.Ping.users.service;

// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;
import com.hire_me.Ping.users.entity.User;
import com.hire_me.Ping.users.repo.UserRepository;
// import com.hire_me.Ping.users.dto.LoginRequest;
// import com.hire_me.Ping.users.dto.RegisterRequest;
import com.hire_me.Ping.users.dto.UserPublicDto;
import com.hire_me.Ping.users.dto.UserUpdateRequest;
import com.hire_me.Ping.users.mapper.UserMapper;

@Service
public class UserService {
    private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        // this.passwordEncoder = passwordEncoder;
    }

    // public UserPublicDto login(LoginRequest loginRequest) {
    //     // 1. Find the user by their username
    //     User user = userRepository.findByUsername(loginRequest.getUsername())
    //             .orElseThrow(() -> new RuntimeException("Invalid username or password"));

    //     // 2. Check if the provided password matches the stored hash
    //     if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
    //         throw new RuntimeException("Invalid username or password");
    //     }

    //     // 3. If everything is correct, return the user's public data
    //     return UserMapper.toPublicDto(user);
    // }

    // public UserPublicDto register(RegisterRequest request) {
    //     // 1. Check if username or email already exists
    //     if (userRepository.existsByUsername(request.getUsername())) {
    //         throw new RuntimeException("Username is already taken");
    //     }
    //     if (userRepository.existsByEmail(request.getEmail())) {
    //         throw new RuntimeException("Email is already in use");
    //     }

    //     // 2. Create and set up the new user
    //     User newUser = new User();
    //     newUser.setUsername(request.getUsername());
    //     newUser.setEmail(request.getEmail());
    //     newUser.setDisplayName(request.getDisplayName());
    //     newUser.setProfileUrl(request.getProfileUrl());

    //     // 3. Hash the password before saving
    //     newUser.setPassword(passwordEncoder.encode(request.getPassword()));

    //     // 4. Save the new user to the database
    //     User savedUser = userRepository.save(newUser);

    //     // 5. Return the public data of the newly created user
    //     return UserMapper.toPublicDto(savedUser);
    // }

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
