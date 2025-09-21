package com.hire_me.Ping.kanban.ws;
import com.hire_me.Ping.kanban.dto.BoardResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import java.util.UUID;
@Component
public class KanbanEvents {
    public enum EventType { created, updated, deleted }
    public static final class Payload {
        private final EventType type;
        private final UUID boardId;
        private final BoardResponse board;
        public Payload(EventType type, UUID boardId, BoardResponse board) {
            this.type = type;
            this.boardId = boardId;
            this.board = board;
        }
        public EventType getType() { return type; }
        public UUID getBoardId() { return boardId; }
        public BoardResponse getBoard() { return board; }
    }
    private final SimpMessagingTemplate simp;
    public KanbanEvents(SimpMessagingTemplate simp) {
        this.simp = simp;
    }
    public void toBoard(UUID boardId, EventType type, BoardResponse board) {
        simp.convertAndSend(BoardTopics.board(boardId), new Payload(type, boardId, board));
    }
}