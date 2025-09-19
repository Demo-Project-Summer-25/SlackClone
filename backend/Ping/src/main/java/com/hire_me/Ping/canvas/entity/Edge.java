package com.hire_me.Ping.canvas.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "edges")
public class Edge {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "canvas_id", nullable = false)
    private Canvas canvas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_node_id", nullable = false)
    private Node sourceNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_node_id", nullable = false)
    private Node targetNode;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EdgeKind kind;

    @Column
    private String label;

    @Column(name = "style_json", columnDefinition = "TEXT")
    private String styleJson;

    @Column
    @CreationTimestamp
    private LocalDateTime createdTimestamp;

    @Column
    @UpdateTimestamp
    private LocalDateTime updatedTimestamp;

    public enum EdgeKind {
        ASSOCIATION,
        AGGREGATION,
        COMPOSITION,
        INHERITANCE,
        REALIZATION,
        DEPENDENCY,
        DIRECTIONAL,
        BIDIRECTIONAL
    }

    public Edge() {}

    public Edge(Canvas canvas, Node sourceNode, Node targetNode, EdgeKind kind) {
        this.canvas = canvas;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.kind = kind;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Canvas getCanvas() { return canvas; }
    public void setCanvas(Canvas canvas) { this.canvas = canvas; }

    public Node getSourceNode() { return sourceNode; }
    public void setSourceNode(Node sourceNode) { this.sourceNode = sourceNode; }

    public Node getTargetNode() { return targetNode; }
    public void setTargetNode(Node targetNode) { this.targetNode = targetNode; }

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
