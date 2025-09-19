package com.hire_me.Ping.channels.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import com.hire_me.Ping.users.entity.User;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "channel_members", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_channel_member", 
                         columnNames = {"channel_id", "user_id"})  // Auto-creates index for (channel_id, user_id)
    }
    // Uncomment these indexes when you need better query performance:
    , indexes = {
        @Index(name = "idx_channel_member_user", columnList = "user_id"),     // For finding user's channels
        @Index(name = "idx_channel_member_role", columnList = "role"),        // For permission/role queries  
        @Index(name = "idx_channel_member_joined", columnList = "joined_at")  // For sorting by join date
    }
)
public class ChannelMember {

    public enum Role {
        MEMBER, MANAGER, ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id", nullable = false)
    @NotNull
    private Channel channel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @NotNull
    private Role role = Role.MEMBER;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    // Default constructor
    public ChannelMember() {}

    // Constructor with required fields
    public ChannelMember(Channel channel, User user, Role role) {
        this.channel = channel;
        this.user = user;
        this.role = role;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    // Convenience methods
    public boolean isManager() {
        return role == Role.MANAGER || role == Role.ADMIN;
    }

    public boolean isAdmin() {
        return role == Role.ADMIN;
    }
}