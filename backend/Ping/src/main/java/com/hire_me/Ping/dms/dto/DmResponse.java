package com.hire_me.Ping.dms.dto;

import com.hire_me.Ping.dms.entity.DirectParticipant;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
// - DirectParticipant.NotifyLevel: used to show each participant's notification settings.
// - Instant: represents a specific moment in time (like a timestamp).
// - List + ArrayList: holds multiple participants in this DM.
// - UUID: for unique identifiers instead of Long numbers.


public class DmResponse {
    // This class is the *output model* for a DM.
    // The controller will return this to the frontend whenever
    // we create a DM, fetch one by ID, or list DMs for a user.


    private UUID id;
    // The unique ID of this DM conversation in the database.


    private UUID createdByUserId;
    // The ID of the user who originally created this DM.


    private boolean isGroup;
    // Whether this is a group DM (true) or a one-to-one DM (false).


    private String title;
    // The title (name) of the DM.
    // Example: "Capstone Chat" or "Project Updates".


    private Instant createdAt;
    // When this DM was first created (timestamp).


    private List<ParticipantInfo> participants = new ArrayList<>();
    // A list of all participants (users) in this DM.
    // Each participant is represented by the nested ParticipantInfo class below.
    // Starts off as an empty list, ready to be filled.


    // ---------- Nested static class: ParticipantInfo ----------
    // This is an "inner DTO" that represents one participant inside the DM.
    // Each DMResponse will contain a list of these ParticipantInfo objects.

    public static class ParticipantInfo {
        private UUID userId;
        // The user's ID (unique identifier in the system).

        private boolean isAdmin;
        // Whether this user is an admin in this DM.
        // Admins may have special privileges like renaming or adding/removing participants.

        private Instant joinedAt;
        // The timestamp when this user joined the DM.

        private Instant leftAt;
        // The timestamp when this user left the DM (null if they are still in the conversation).

        private DirectParticipant.NotifyLevel notifyLevel;
        // The user's notification preference for this DM.
        // (ALL, MENTIONS, NONE, etc.)


        // ----- Getters and Setters for ParticipantInfo -----
        // These methods allow reading and updating fields.
        // Spring/Jackson use these automatically when converting to/from JSON.

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }

        public boolean isAdmin() { return isAdmin; }
        public void setAdmin(boolean admin) { isAdmin = admin; }

        public Instant getJoinedAt() { return joinedAt; }
        public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }

        public Instant getLeftAt() { return leftAt; }
        public void setLeftAt(Instant leftAt) { this.leftAt = leftAt; }

        public DirectParticipant.NotifyLevel getNotifyLevel() { return notifyLevel; }
        public void setNotifyLevel(DirectParticipant.NotifyLevel notifyLevel) { this.notifyLevel = notifyLevel; }
    }


    // ----- Getters and Setters for DmResponse -----
    // These expose the outer DMResponse fields.

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(UUID createdByUserId) { this.createdByUserId = createdByUserId; }

    public boolean isGroup() { return isGroup; }
    public void setGroup(boolean group) { isGroup = group; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<ParticipantInfo> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantInfo> participants) { this.participants = participants; }
}