package com.hire_me.Ping.canvas.dto;

import java.util.UUID;
import jakarta.validation.constraints.NotNull;

import com.hire_me.Ping.canvas.entity.Edge.EdgeKind;

public class EdgeCreateRequest {
    @NotNull(message = "Source node ID cannot be null")
    private UUID sourceNodeId;

    @NotNull(message = "Target node ID cannot be null")
    private UUID targetNodeId;

    @NotNull(message = "Edge kind cannot be null")
    private EdgeKind kind;

    private String label;
    private String styleJson;

    public EdgeCreateRequest() {}

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
}
