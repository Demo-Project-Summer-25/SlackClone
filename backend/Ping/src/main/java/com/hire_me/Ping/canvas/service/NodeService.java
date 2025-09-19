package com.hire_me.Ping.canvas.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hire_me.Ping.canvas.dto.*;
import com.hire_me.Ping.canvas.entity.Canvas;
import com.hire_me.Ping.canvas.entity.Node;
import com.hire_me.Ping.canvas.repo.CanvasRepository;
import com.hire_me.Ping.canvas.repo.NodeRepository;
import com.hire_me.Ping.canvas.repo.EdgeRepository;

@Service
@Transactional
public class NodeService {

    @Autowired
    private NodeRepository nodeRepository;
    
    @Autowired
    private CanvasRepository canvasRepository;
    
    @Autowired
    private EdgeRepository edgeRepository;

    // Create node
    public NodeDto createNode(UUID canvasId, NodeCreateRequest request) {
        Canvas canvas = canvasRepository.findById(canvasId)
                .orElseThrow(() -> new RuntimeException("Canvas not found"));

        Node node = new Node();
        node.setCanvas(canvas);
        node.setKind(request.getKind());
        node.setCardId(request.getCardId());
        node.setText(request.getText());
        node.setMediaUrl(request.getMediaUrl());
        node.setX(request.getX());
        node.setY(request.getY());
        node.setWidth(request.getWidth());
        node.setHeight(request.getHeight());
        node.setRotation(request.getRotation());
        node.setZIndex(request.getZIndex());
        node.setStyleJson(request.getStyleJson());

        Node savedNode = nodeRepository.save(node);
        return convertToDto(savedNode);
    }

    // Get nodes by canvas
    public List<NodeDto> getNodesByCanvas(UUID canvasId) {
        return nodeRepository.findByCanvasIdOrderByZIndexAsc(canvasId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Update node
    public NodeDto updateNode(UUID nodeId, NodeUpdateRequest request) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found"));

        if (request.getKind() != null) {
            node.setKind(request.getKind());
        }
        if (request.getCardId() != null) {
            node.setCardId(request.getCardId());
        }
        if (request.getText() != null) {
            node.setText(request.getText());
        }
        if (request.getMediaUrl() != null) {
            node.setMediaUrl(request.getMediaUrl());
        }
        if (request.getX() != null) {
            node.setX(request.getX());
        }
        if (request.getY() != null) {
            node.setY(request.getY());
        }
        if (request.getWidth() != null) {
            node.setWidth(request.getWidth());
        }
        if (request.getHeight() != null) {
            node.setHeight(request.getHeight());
        }
        if (request.getRotation() != null) {
            node.setRotation(request.getRotation());
        }
        if (request.getZIndex() != null) {
            node.setZIndex(request.getZIndex());
        }
        if (request.getStyleJson() != null) {
            node.setStyleJson(request.getStyleJson());
        }

        Node savedNode = nodeRepository.save(node);
        return convertToDto(savedNode);
    }

    
    public void deleteNode(UUID nodeId) {
        if (!nodeRepository.existsById(nodeId)) {
            throw new RuntimeException("Node not found");
        }
        
        
        edgeRepository.deleteByConnectedNodeId(nodeId);
        
        
        nodeRepository.deleteById(nodeId);
    }

    
    private NodeDto convertToDto(Node node) {
        NodeDto dto = new NodeDto();
        dto.setId(node.getId());
        dto.setCanvasId(node.getCanvas().getId());
        dto.setKind(node.getKind());
        dto.setCardId(node.getCardId());
        dto.setText(node.getText());
        dto.setMediaUrl(node.getMediaUrl());
        dto.setX(node.getX());
        dto.setY(node.getY());
        dto.setWidth(node.getWidth());
        dto.setHeight(node.getHeight());
        dto.setRotation(node.getRotation());
        dto.setZIndex(node.getZIndex());
        dto.setStyleJson(node.getStyleJson());
        dto.setCreatedTimestamp(node.getCreatedTimestamp());
        dto.setUpdatedTimestamp(node.getUpdatedTimestamp());
        return dto;
    }
}
