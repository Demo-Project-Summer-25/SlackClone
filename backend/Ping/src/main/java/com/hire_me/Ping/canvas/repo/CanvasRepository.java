package com.hire_me.Ping.canvas.repo;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hire_me.Ping.canvas.entity.Canvas;

@Repository
public interface CanvasRepository extends JpaRepository<Canvas, UUID> {
    List<Canvas> findByCreatedByUserId (UUID userId);
    List<Canvas> findByChannelId (UUID channelId);
    List<Canvas> findByBoardId (UUID boardId);
    List<Canvas> findByTitleContainingIgnoreCase (String title);
    long countByCreatedByUserId (UUID userId);
    List<Canvas> findAllByOrderByCreatedTimestampDesc();
    boolean existsByIdAndCreatedByUserId(UUID canvasId, UUID userId);
}
