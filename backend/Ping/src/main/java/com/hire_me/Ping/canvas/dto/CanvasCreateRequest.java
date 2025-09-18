package com.hire_me.Ping.canvas.dto;

import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CanvasCreateRequest { 
    @NotBlank (message = "Canvas title cannot be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private UUID channelId;
    private UUID boardId;

    public CanvasCreateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public UUID getChannelId() { return channelId; }
    public void setChannelId(UUID channelId) { this.channelId = channelId; }

    public UUID getBoardId() { return boardId; }
    public void setBoardId(UUID boardId) { this.boardId = boardId; }
    
}
