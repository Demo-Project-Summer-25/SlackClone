package com.hire_me.Ping.canvas.dto;

import java.util.UUID;
import jakarta.validation.constraints.Size;

public class CanvasUpdateRequest {
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    private UUID channelId;
    private UUID boardId;
    private Double zoom;
    private Double panX;
    private Double panY;

    public CanvasUpdateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public UUID getChannelId() { return channelId; }
    public void setChannelId(UUID channelId) { this.channelId = channelId; }

    public UUID getBoardId() { return boardId; }
    public void setBoardId(UUID boardId) { this.boardId = boardId; }

    public Double getZoom() { return zoom; }
    public void setZoom(Double zoom) { this.zoom = zoom; }

    public Double getPanX() { return panX; }
    public void setPanX(Double panX) { this.panX = panX; }

    public Double getPanY() { return panY; }
    public void setPanY(Double panY) { this.panY = panY; }

}
