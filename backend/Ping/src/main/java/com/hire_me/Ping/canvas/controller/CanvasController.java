package com.hire_me.Ping.canvas.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hire_me.Ping.canvas.dto.*;
import com.hire_me.Ping.canvas.service.CanvasService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/canvases")
@CrossOrigin(origins = "*")
public class CanvasController {

    @Autowired
    private CanvasService canvasService;

    
    @PostMapping
    public ResponseEntity<CanvasDto> createCanvas(
            @Valid @RequestBody CanvasCreateRequest request,
            @RequestParam UUID createdByUserId) {

        CanvasDto createdCanvas = canvasService.createCanvas(request, createdByUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCanvas);
    }

    
    @GetMapping
    public ResponseEntity<List<CanvasDto>> getAllCanvases() {
        List<CanvasDto> canvases = canvasService.getAllCanvases();
        return ResponseEntity.ok(canvases);
    }

    
    @GetMapping("/{canvasId}")
    public ResponseEntity<CanvasDto> getCanvasById(@PathVariable UUID canvasId) {
        CanvasDto canvas = canvasService.getCanvasById(canvasId);
        return ResponseEntity.ok(canvas);
    }

    
    @PutMapping("/{canvasId}")
    public ResponseEntity<CanvasDto> updateCanvas(
            @PathVariable UUID canvasId,
            @Valid @RequestBody CanvasUpdateRequest request) {
        CanvasDto canvas = canvasService.updateCanvas(canvasId, request);
        return ResponseEntity.ok(canvas);
    }

    
    @DeleteMapping("/{canvasId}")
    public ResponseEntity<Void> deleteCanvas(@PathVariable UUID canvasId) {
        canvasService.deleteCanvas(canvasId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CanvasDto>> getCanvasesByUser(@PathVariable UUID userId) {
        List<CanvasDto> canvases = canvasService.getCanvasesByUser(userId);
        return ResponseEntity.ok(canvases);
    }
    
}
