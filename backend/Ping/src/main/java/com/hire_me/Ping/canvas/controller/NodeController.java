package com.hire_me.Ping.canvas.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hire_me.Ping.canvas.dto.*;
import com.hire_me.Ping.canvas.service.NodeService;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class NodeController {

    @Autowired
    private NodeService nodeService;

    @PostMapping("/canvases/{canvasId}/nodes")
    public ResponseEntity<NodeDto> createNode(
            @PathVariable UUID canvasId,
            @Valid @RequestBody NodeCreateRequest request) {

        NodeDto node = nodeService.createNode(canvasId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(node);
    }
    @GetMapping("/canvases/{canvasId}/nodes")
    public ResponseEntity<List<NodeDto>> getNodesByCanvas(@PathVariable UUID canvasId) {
        List<NodeDto> nodes = nodeService.getNodesByCanvas(canvasId);
        return ResponseEntity.ok(nodes);
    }

    @PatchMapping("/nodes/{nodeId}")
    public ResponseEntity<NodeDto> updateNode(
            @PathVariable UUID nodeId,
            @Valid @RequestBody NodeUpdateRequest request) {

        NodeDto updatedNode = nodeService.updateNode(nodeId, request);
        return ResponseEntity.ok(updatedNode);
    }

    @DeleteMapping("/nodes/{nodeId}")
    public ResponseEntity<Void> deleteNode(@PathVariable UUID nodeId) {
        nodeService.deleteNode(nodeId);
        return ResponseEntity.noContent().build();
    }
}
