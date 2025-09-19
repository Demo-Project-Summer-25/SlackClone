package com.hire_me.Ping.users.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
// import org.springframework.http.HttpStatus;
import java.util.UUID;
import java.util.List;
import com.hire_me.Ping.users.service.UserService;
// import com.hire_me.Ping.users.dto.LoginRequest;
// import com.hire_me.Ping.users.dto.RegisterRequest;
import com.hire_me.Ping.users.dto.UserPublicDto;
import com.hire_me.Ping.users.dto.UserUpdateRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserPublicDto> getUserById(@PathVariable UUID id) {
        UserPublicDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping
    public ResponseEntity<List<UserPublicDto>> getAllUsers() {
        List<UserPublicDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserPublicDto> updateUser(
            @PathVariable UUID id,
            @RequestBody UserUpdateRequest updateRequest) {
        UserPublicDto updatedUser = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    // @PostMapping("/login")
    // public ResponseEntity<UserPublicDto> login(@RequestBody LoginRequest loginRequest) {
    //     UserPublicDto userDto = userService.login(loginRequest);
    //     return ResponseEntity.ok(userDto);
    // }

    // @PostMapping("/register")
    // public ResponseEntity<UserPublicDto> register(@RequestBody RegisterRequest registerRequest) {
    //     UserPublicDto createdUser = userService.register(registerRequest);
    //     return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    // }
}
