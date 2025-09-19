package com.hire_me.Ping.canvas.repo;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.hire_me.Ping.canvas.entity.Node;
import com.hire_me.Ping.canvas.entity.Node.NodeKind;

@Repository
public interface NodeRepository extends JpaRepository<Node, UUID> {
    List<Node> findByCanvasId(UUID canvasId);
    
    @Query("SELECT n FROM Node n WHERE n.canvas.id = :canvasId ORDER BY n.zIndex ASC")
    List<Node> findByCanvasIdOrderByZIndexAsc(@Param("canvasId") UUID canvasId);
    
    List<Node> findByKind(NodeKind kind);
    List<Node> findByCanvasIdAndKind(UUID canvasId, NodeKind kind);
    long countByCanvasId(UUID canvasId);
    void deleteByCanvasId(UUID canvasId);
    
    default List<Node> findUmlClassesByCanvasId(UUID canvasId) {
        return findByCanvasIdAndKind(canvasId, NodeKind.CLASS);
    }
}
