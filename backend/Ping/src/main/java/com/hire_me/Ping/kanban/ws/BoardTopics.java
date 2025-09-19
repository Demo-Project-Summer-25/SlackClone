package com.hire_me.Ping.kanban.ws;

import java.util.UUID;

public final class BoardTopics {
    private BoardTopics() {}

    public static final String ROOT = "/topic/boards";

    public static String board(UUID boardId) {
        return ROOT + "/" + boardId;
    }
}
