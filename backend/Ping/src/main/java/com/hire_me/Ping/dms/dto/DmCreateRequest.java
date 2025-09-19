package com.hire_me.Ping.dms.dto;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
// We need List (to hold participants) and ArrayList (a concrete implementation of List).
// This lets us store multiple participants inside this request object.
// We need UUID because user IDs are now UUIDs instead of Long numbers.


public class DmCreateRequest {
    // This class represents the data the client (frontend) will send us
    // when they want to create a new Direct Message (DM).
    // It doesn't have any business logic — it just holds values.


    private UUID createdByUserId;
    // The ID of the user who is creating this DM.
    // Example: If Josiah creates a DM, his user UUID will go here.


    private boolean group;
    // A flag (true/false) to say whether this DM is:
    // - false → just a normal one-to-one DM
    // - true → a group DM with multiple participants.


    private String title;
    // The title (or name) of the conversation.
    // - For a group DM, this might be "Study Group" or "Project Team".
    // - For a one-to-one DM, it might be optional or auto-generated.


    private List<DmParticipantRequest> participants = new ArrayList<>();
    // A list of participants (users) who should be in this DM.
    // Each participant is represented by a DmParticipantRequest object.
    // We initialize it as an empty ArrayList so it's ready to be filled.


    // ------- GETTERS AND SETTERS --------
    // These methods let us safely read (get) and update (set) the fields above.
    // Spring will use them automatically when mapping JSON data from the request.


    public UUID getCreatedByUserId() {
        return createdByUserId;
    }
    // Returns the ID of the user who created the DM.

    public void setCreatedByUserId(UUID createdByUserId) {
        this.createdByUserId = createdByUserId;
    }
    // Sets the ID of the user who created the DM.


    public boolean isGroup() {
        return group;
    }
    // Returns true if this DM is a group conversation, false if it's 1-to-1.

    public void setGroup(boolean group) {
        this.group = group;
    }
    // Sets whether this DM is a group or not.


    public String getTitle() {
        return title;
    }
    // Returns the title of the DM.

    public void setTitle(String title) {
        this.title = title;
    }
    // Sets the title of the DM.


    public List<DmParticipantRequest> getParticipants() {
        return participants;
    }
    // Returns the list of participants for this DM.

    public void setParticipants(List<DmParticipantRequest> participants) {
        this.participants = participants;
    }
    // Sets the list of participants for this DM.
}