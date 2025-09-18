package com.hire_me.Ping.canvas.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.hire_me.Ping.canvas.dto.EdgeDto;
import com.hire_me.Ping.canvas.entity.Edge;

public class CanvasDto {
    private UUID id;
    private String title;
    private UUID channelId;
    private UUID boardId;
    private Double zoom;
    private Double panX;
    private Double panY;
    private UUID createdByUserId;
    private List<NodeDto> nodes;
    private List<EdgeDto> edges;
    private LocalDateTime createdTimestamp;
    private LocalDateTime updatedTimestamp;

    public CanvasDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public UUID getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(UUID createdByUserId) { this.createdByUserId = createdByUserId; }

    public List<NodeDto> getNodes() { return nodes; }
    public void setNodes(List<NodeDto> nodes) { this.nodes = nodes; }

    public List<EdgeDto> getEdges() { return edges; }
    public void setEdges(List<EdgeDto> edges) { this.edges = edges; }

    public LocalDateTime getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(LocalDateTime createdTimestamp) { this.createdTimestamp = createdTimestamp; }

    public LocalDateTime getUpdatedTimestamp() { return updatedTimestamp; }
    public void setUpdatedTimestamp(LocalDateTime updatedTimestamp) { this.updatedTimestamp = updatedTimestamp; }
}
