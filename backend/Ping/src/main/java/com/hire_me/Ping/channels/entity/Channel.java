package com.hire_me.Ping.channels.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import com.hire_me.Ping.users.entity.User;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "channels"
    // Uncomment these indexes when you need better query performance:
    // , indexes = {
    //     @Index(name = "idx_channel_public", columnList = "is_public"),      // For finding public channels
    //     @Index(name = "idx_channel_created_by", columnList = "created_by"), // For "my channels" queries
    //     @Index(name = "idx_channel_created_at", columnList = "created_at")  // For sorting channels by date
    // }
)
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Channel name cannot be blank")
    private String name;

    private String description;

    @Column(name = "is_public", nullable = false)
    @NotNull
    private Boolean isPublic = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ChannelMember> members = new HashSet<>();

    // Default constructor
    public Channel() {}

    // Constructor with required fields
    public Channel(String name, User createdBy) {
        this.name = name;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean isPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Set<ChannelMember> getMembers() {
        return members;
    }

    public void setMembers(Set<ChannelMember> members) {
        this.members = members;
    }

    // Helper methods for managing bidirectional relationships
    public void addMember(ChannelMember member) {
        members.add(member);
        member.setChannel(this);
    }

    public void removeMember(ChannelMember member) {
        members.remove(member);
        member.setChannel(null);
    }
}