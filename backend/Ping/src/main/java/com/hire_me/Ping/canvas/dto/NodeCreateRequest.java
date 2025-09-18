package com.hire_me.Ping.canvas.dto;

import java.util.UUID;

import com.hire_me.Ping.canvas.entity.Node.NodeKind;

import jakarta.validation.constraints.NotNull;

public class NodeCreateRequest {
    @NotNull(message = "Node kind is required")
    private NodeKind kind;

    private UUID cardId;
    private String text;
    private String mediaUrl;

    @NotNull(message = "X coordinate is required")
    private Double x;

    @NotNull(message = "Y coordinate is required")
    private Double y;

    @NotNull(message = "Width is required")
    private Double width;

    @NotNull(message = "Height is required")
    private Double height;

    private Double rotation = 0.0;
    private Integer zIndex = 0;
    private String styleJson;

    public NodeCreateRequest() {}

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
}
