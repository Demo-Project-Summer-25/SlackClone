package com.hire_me.Ping.canvas.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "nodes")
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "canvas_id", nullable = false)
    private Canvas canvas;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NodeKind kind;

    @Column(name = "card_id")
    private UUID cardId;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(nullable = false)
    private Double x;

    @Column(nullable = false)
    private Double y;

    @Column(nullable = false)
    private Double width;

    @Column(nullable = false)
    private Double height;  

    @Column
    private Double rotation = 0.0;

    @Column(name = "z_index")
    private Integer zIndex = 0;

    @Column(name = "style_json", columnDefinition = "TEXT")
    private String styleJson;

    @Column
    @CreationTimestamp
    private LocalDateTime createdTimestamp;

    @Column
    @UpdateTimestamp
    private LocalDateTime updatedTimestamp;

    
    public enum NodeKind {
        CLASS,
        INTERFACE,
        ABSTRACT_CLASS,
        ENUM,
        TEXT,
        IMAGE,
        SHAPE,
        STICKY_NOTE
    }

    public Node() {}

    public Node(Canvas canvas, NodeKind kind, Double x, Double y, Double width, Double height) {
        this.canvas = canvas;
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Canvas getCanvas() { return canvas; }
    public void setCanvas(Canvas canvas) { this.canvas = canvas; }

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
