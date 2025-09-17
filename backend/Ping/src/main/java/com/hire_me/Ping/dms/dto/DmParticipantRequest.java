package com.hire_me.Ping.dms.dto;


import com.hire_me.Ping.dms.entity.DirectParticipant;
// We import DirectParticipant because we need its inner enum (NotifyLevel).
// Enums are like a fixed set of options (ALL, MENTIONS_ONLY, NONE, etc.).


public class DmParticipantRequest {
    // This class represents ONE participant inside a DM.
    // It’s used both when creating a DM (inside DmCreateRequest)
    // and when adding a new participant to an existing DM.


    private Long userId;
    // The ID of the user we want to add to the DM.
    // Example: if we’re adding Josiah and his userId is 5, this field = 5.


    private Boolean admin; // optional, defaults to false
    // Whether this user should be an admin in the DM.
    // - true → they are an admin (can manage participants, rename chat, etc.)
    // - false (or null) → just a normal participant.
    // Default is false, so if the client doesn’t send anything, they are NOT admin.


    private DirectParticipant.NotifyLevel notifyLevel; // optional, defaults to ALL
    // This says how much this user wants to be notified about this DM.
    // It comes from the enum inside DirectParticipant.
    // Possible values might be something like:
    //   - ALL → notify on every message
    //   - MENTIONS_ONLY → only notify if they are mentioned with @username
    //   - NONE → no notifications
    // Default = ALL if not specified.


    // -------- GETTERS AND SETTERS --------
    // These allow Spring to read/write the fields when JSON is sent in a request.


    public Long getUserId() {
        return userId;
    }
    // Returns the user’s ID.

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    // Sets the user’s ID.


    public Boolean getAdmin() {
        return admin;
    }
    // Returns true/false (or null) if this participant is an admin.

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }
    // Sets whether this participant is an admin.


    public DirectParticipant.NotifyLevel getNotifyLevel() {
        return notifyLevel;
    }
    // Returns the chosen notify level (ALL, MENTIONS_ONLY, NONE).

    public void setNotifyLevel(DirectParticipant.NotifyLevel notifyLevel) {
        this.notifyLevel = notifyLevel;
    }
    // Sets the notify level for this participant.
}