package com.hire_me.Ping.canvas.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hire_me.Ping.canvas.dto.*;
import com.hire_me.Ping.canvas.entity.Canvas;
import com.hire_me.Ping.canvas.repo.CanvasRepository;
import com.hire_me.Ping.canvas.repo.NodeRepository;
import com.hire_me.Ping.canvas.repo.EdgeRepository;

@Service
@Transactional
public class CanvasService {

    @Autowired
    private CanvasRepository canvasRepository;

    @Autowired
    private NodeRepository nodeRepository;

    @Autowired
    private EdgeRepository edgeRepository;

    
    public CanvasDto createCanvas(CanvasCreateRequest request, UUID createdByUserId) {
        Canvas canvas = new Canvas();
        canvas.setTitle(request.getTitle());
        canvas.setChannelId(request.getChannelId());
        canvas.setBoardId(request.getBoardId());
        canvas.setCreatedByUserId(createdByUserId);

        Canvas savedCanvas = canvasRepository.save(canvas);
        return convertToDto(savedCanvas);
    }

    
    public List<CanvasDto> getAllCanvases() {
        return canvasRepository.findAllByOrderByCreatedTimestampDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    
    public CanvasDto getCanvasById(UUID canvasId) {
        Canvas canvas = canvasRepository.findById(canvasId)
                .orElseThrow(() -> new RuntimeException("Canvas not found"));
        return convertToDto(canvas);
    }

    
    public CanvasDto updateCanvas(UUID canvasId, CanvasUpdateRequest request) {
        Canvas canvas = canvasRepository.findById(canvasId)
                .orElseThrow(() -> new RuntimeException("Canvas not found"));

        if (request.getTitle() != null) {
            canvas.setTitle(request.getTitle());
        }
        if (request.getChannelId() != null) {
            canvas.setChannelId(request.getChannelId());
        }
        if (request.getBoardId() != null) {
            canvas.setBoardId(request.getBoardId());
        }
        if (request.getZoom() != null) {
            canvas.setZoom(request.getZoom());
        }
        if (request.getPanX() != null) {
            canvas.setPanX(request.getPanX());
        }
        if (request.getPanY() != null) {
            canvas.setPanY(request.getPanY());
        } 

        Canvas savedCanvas = canvasRepository.save(canvas);
        return convertToDto(savedCanvas);
    }

    
    public void deleteCanvas(UUID canvasId) {
        if (!canvasRepository.existsById(canvasId)) {
            throw new RuntimeException("Canvas not found");
        }
        canvasRepository.deleteById(canvasId);
    }

    
    public List<CanvasDto> getCanvasesByUser(UUID userId) {
        return canvasRepository.findByCreatedByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    
    private CanvasDto convertToDto(Canvas canvas) {
        CanvasDto dto = new CanvasDto();
        dto.setId(canvas.getId());
        dto.setTitle(canvas.getTitle());
        dto.setChannelId(canvas.getChannelId());
        dto.setBoardId(canvas.getBoardId());
        dto.setZoom(canvas.getZoom());
        dto.setPanX(canvas.getPanX());
        dto.setPanY(canvas.getPanY());
        dto.setCreatedByUserId(canvas.getCreatedByUserId());
        dto.setCreatedTimestamp(canvas.getCreatedTimestamp());
        dto.setUpdatedTimestamp(canvas.getUpdatedTimestamp());
        return dto;
    }
}
