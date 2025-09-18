package com.hire_me.Ping.canvas.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.hire_me.Ping.canvas.entity.Edge;
import com.hire_me.Ping.canvas.entity.Node;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "canvases")
public class Canvas {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    @NotBlank(message = "Canvas title must not be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Column(name = "channel_id")
    private UUID channelId;

    @Column(name = "board_id")
    private UUID boardId;

    @Column(nullable = false)
    private Double zoom = 1.0;

    @Column(nullable = false)
    private Double panX = 0.0;

    @Column(nullable = false)
    private Double panY = 0.0;

    @Column(name = "created_by_user_id", nullable = false)
    private UUID createdByUserId;

    @OneToMany(mappedBy = "canvas", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Node> nodes;

    @OneToMany(mappedBy = "canvas", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Edge> edges;

    @Column
    @CreationTimestamp
    private LocalDateTime createdTimestamp;

    @Column
    @UpdateTimestamp
    private LocalDateTime updatedTimestamp;

    public Canvas() {}

    public Canvas(String title, UUID createdByUserId) {
        this.title = title;
        this.createdByUserId = createdByUserId;
    }

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

    public List<Node> getNodes() { return nodes; }
    public void setNodes(List<Node> nodes) { this.nodes = nodes; }

    public List<Edge> getEdges() { return edges; }
    public void setEdges(List<Edge> edges) { this.edges = edges; }

    public LocalDateTime getCreatedTimestamp() { return createdTimestamp; }
    public void setCreatedTimestamp(LocalDateTime createdTimestamp) { this.createdTimestamp = createdTimestamp; }

    public LocalDateTime getUpdatedTimestamp() { return updatedTimestamp; }
    public void setUpdatedTimestamp(LocalDateTime updatedTimestamp) { this.updatedTimestamp = updatedTimestamp; }

}
