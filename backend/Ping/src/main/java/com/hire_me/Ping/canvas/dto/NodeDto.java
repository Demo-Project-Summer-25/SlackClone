package com.hire_me.Ping.canvas.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import com.hire_me.Ping.canvas.entity.Node.NodeKind;

public class NodeDto {
    private UUID id;
    private UUID canvasId;
    private NodeKind kind;
    private UUID cardId;
    private String text;
    private String mediaUrl;
    private Double x;
    private Double y;
    private Double width;
    private Double height;
    private Double rotation;
    private Integer zIndex;
    private String styleJson;
    private LocalDateTime createdTimestamp;
    private LocalDateTime updatedTimestamp;     

    public NodeDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCanvasId() { return canvasId; }
    public void setCanvasId(UUID canvasId) { this.canvasId = canvasId; }

    public NodeKind getKind() { return kind; }
    public void setKind(NodeKind kind) { this.kind = kind; }

    public UUID getCardId() { return cardId; }
    public void setCardId(UUID cardId) { this.cardId = cardId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }  

    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }

    public Double getWidth() { return width; }
    public void setWidth(Double width) { this.width = width; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getRotation() { return rotation; }
    public void setRotation(Double rotation) { this.rotation = rotation; }

    public Integer getZIndex() { return zIndex; }
    public void setZIndex(Integer zIndex) { this.zIndex = zIndex; }

    public String getStyleJson() { return styleJson; }
    public void setStyleJson(String styleJson) { this.styleJson = styleJson; }

    public LocalDateTime getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(LocalDateTime createdTimestamp) { this.createdTimestamp = createdTimestamp; }

    public LocalDateTime getUpdatedTimestamp() { return updatedTimestamp; }
    public void setUpdatedTimestamp(LocalDateTime updatedTimestamp) { this.updatedTimestamp = updatedTimestamp; }
    
}
