package com.hire_me.Ping.canvas.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import com.hire_me.Ping.canvas.entity.Edge.EdgeKind;

public class EdgeDto {
    private UUID id;
    private UUID canvasId;
    private UUID sourceNodeId;
    private UUID targetNodeId;
    private EdgeKind kind;
    private String label;
    private String styleJson;
    private LocalDateTime createdTimestamp;  // ONLY these timestamp fields
    private LocalDateTime updatedTimestamp;  // ONLY these timestamp fields

    public EdgeDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCanvasId() { return canvasId; }
    public void setCanvasId(UUID canvasId) { this.canvasId = canvasId; }

    public UUID getSourceNodeId() { return sourceNodeId; }
    public void setSourceNodeId(UUID sourceNodeId) { this.sourceNodeId = sourceNodeId; }

    public UUID getTargetNodeId() { return targetNodeId; }
    public void setTargetNodeId(UUID targetNodeId) { this.targetNodeId = targetNodeId; }

    public EdgeKind getKind() { return kind; }
    public void setKind(EdgeKind kind) { this.kind = kind; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getStyleJson() { return styleJson; }
    public void setStyleJson(String styleJson) { this.styleJson = styleJson; }

    public LocalDateTime getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(LocalDateTime createdTimestamp) { this.createdTimestamp = createdTimestamp; }

    public LocalDateTime getUpdatedTimestamp() { return updatedTimestamp; }
    public void setUpdatedTimestamp(LocalDateTime updatedTimestamp) { this.updatedTimestamp = updatedTimestamp; }
}

