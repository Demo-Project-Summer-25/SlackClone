package com.hire_me.Ping.canvas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import com.hire_me.Ping.canvas.dto.*;
import com.hire_me.Ping.canvas.repo.EdgeRepository;

@Service
public class EdgeService {
    
    @Autowired
    private EdgeRepository edgeRepository;
    
    public EdgeDto createEdge(UUID canvasId, EdgeCreateRequest request) {
        // Implementation will come later
        throw new RuntimeException("Edge service not implemented yet");
    }
    
    public List<EdgeDto> getEdgesByCanvas(UUID canvasId) {
        // Implementation will come later  
        throw new RuntimeException("Edge service not implemented yet");
    }
    
    public EdgeDto updateEdge(UUID edgeId, EdgeUpdateRequest request) {
        // Implementation will come later
        throw new RuntimeException("Edge service not implemented yet");
    }
    
    public void deleteEdge(UUID edgeId) {
        // Implementation will come later
        throw new RuntimeException("Edge service not implemented yet");
    }
}