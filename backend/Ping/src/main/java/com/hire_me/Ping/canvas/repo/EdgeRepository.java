package com.hire_me.Ping.canvas.repo;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.hire_me.Ping.canvas.entity.Edge;
import com.hire_me.Ping.canvas.entity.Edge.EdgeKind;

@Repository
public interface EdgeRepository extends JpaRepository<Edge, UUID> {
    List<Edge> findByCanvasId(UUID canvasId);
    List<Edge> findBySourceNodeId(UUID sourceNodeId);
    List<Edge> findByTargetNodeId(UUID targetNodeId);
    List<Edge> findByKind(EdgeKind kind);
    List<Edge> findByCanvasIdAndKind(UUID canvasId, EdgeKind kind);
    @Query("SELECT e FROM Edge e WHERE e.sourceNode.id = :nodeId OR e.targetNode.id = :nodeId")
    List<Edge> findByConnectedNodeId(@Param("nodeId") UUID nodeId);
    @Query("SELECT e FROM Edge e WHERE (e.sourceNode.id = :node1Id AND e.targetNode.id = :node2Id) OR (e.sourceNode.id = :node2Id AND e.targetNode.id = :node1Id)")
    List<Edge> findEdgesBetweenNodes(@Param("node1Id") UUID node1Id, @Param("node2Id") UUID node2Id);
    long countByCanvasId(UUID canvasId);
    void deleteByCanvasId(UUID canvasId);
    @Query("DELETE FROM Edge e WHERE e.sourceNode.id = :nodeId OR e.targetNode.id = :nodeId")
    void deleteByConnectedNodeId(@Param("nodeId") UUID nodeId);
}
