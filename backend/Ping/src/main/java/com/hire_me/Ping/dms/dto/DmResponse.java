package com.hire_me.Ping.dms.dto;


import com.hire_me.Ping.dms.entity.DirectParticipant;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
// - DirectParticipant.NotifyLevel: used to show each participant’s notification settings.
// - Instant: represents a specific moment in time (like a timestamp).
// - List + ArrayList: holds multiple participants in this DM.


public class DmResponse {
    // This class is the *output model* for a DM.
    // The controller will return this to the frontend whenever
    // we create a DM, fetch one by ID, or list DMs for a user.


    private Long id;
    // The unique ID of this DM conversation in the database.


    private Long createdByUserId;
    // The ID of the user who originally created this DM.


    private boolean group;
    // Whether this is a group DM (true) or a one-to-one DM (false).


    private String title;
    // The title (name) of the DM.
    // Example: "Capstone Chat" or "Project Updates".


    private Instant createdAt;
    // When this DM was first created (timestamp).


    private List<Participant> participants = new ArrayList<>();
    // A list of all participants (users) in this DM.
    // Each participant is represented by the nested Participant class below.
    // Starts off as an empty list, ready to be filled.


    // ---------- Nested static class: Participant ----------
    // This is an "inner DTO" that represents one participant inside the DM.
    // Each DMResponse will contain a list of these Participant objects.

    public static class Participant {
        private Long userId;
        // The user’s ID (unique identifier in the system).

        private boolean admin;
        // Whether this user is an admin in this DM.
        // Admins may have special privileges like renaming or adding/removing participants.

        private Instant joinedAt;
        // The timestamp when this user joined the DM.

        private Instant leftAt;
        // The timestamp when this user left the DM (null if they are still in the conversation).

        private DirectParticipant.NotifyLevel notifyLevel;
        // The user’s notification preference for this DM.
        // (ALL, MENTIONS_ONLY, NONE, etc.)


        // ----- Getters and Setters for Participant -----
        // These methods allow reading and updating fields.
        // Spring/Jackson use these automatically when converting to/from JSON.

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public boolean isAdmin() { return admin; }
        public void setAdmin(boolean admin) { this.admin = admin; }

        public Instant getJoinedAt() { return joinedAt; }
        public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }

        public Instant getLeftAt() { return leftAt; }
        public void setLeftAt(Instant leftAt) { this.leftAt = leftAt; }

        public DirectParticipant.NotifyLevel getNotifyLevel() { return notifyLevel; }
        public void setNotifyLevel(DirectParticipant.NotifyLevel notifyLevel) { this.notifyLevel = notifyLevel; }
    }


    // ----- Getters and Setters for DmResponse -----
    // These expose the outer DMResponse fields.

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }

    public boolean isGroup() { return group; }
    public void setGroup(boolean group) { this.group = group; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<Participant> getParticipants() { return participants; }
    public void setParticipants(List<Participant> participants) { this.participants = participants; }
}