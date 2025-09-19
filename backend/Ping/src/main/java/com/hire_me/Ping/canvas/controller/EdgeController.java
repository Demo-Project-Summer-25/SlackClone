package com.hire_me.Ping.canvas.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hire_me.Ping.canvas.dto.*;
import com.hire_me.Ping.canvas.service.EdgeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EdgeController {

    @Autowired
    private EdgeService edgeService;

    
    @PostMapping("/canvases/{canvasId}/edges")
    public ResponseEntity<EdgeDto> createEdge(
            @PathVariable UUID canvasId,
            @Valid @RequestBody EdgeCreateRequest request) {
        
        EdgeDto edge = edgeService.createEdge(canvasId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(edge);
    }

    
    @GetMapping("/canvases/{canvasId}/edges")
    public ResponseEntity<List<EdgeDto>> getEdgesByCanvas(@PathVariable UUID canvasId) {
        List<EdgeDto> edges = edgeService.getEdgesByCanvas(canvasId);
        return ResponseEntity.ok(edges);
    }

    
    @PatchMapping("/edges/{edgeId}")
    public ResponseEntity<EdgeDto> updateEdge(
            @PathVariable UUID edgeId,
            @Valid @RequestBody EdgeUpdateRequest request) {
        
        EdgeDto edge = edgeService.updateEdge(edgeId, request);
        return ResponseEntity.ok(edge);
    }

    
    @DeleteMapping("/edges/{edgeId}")
    public ResponseEntity<Void> deleteEdge(@PathVariable UUID edgeId) {
        edgeService.deleteEdge(edgeId);
        return ResponseEntity.noContent().build();
    }
}