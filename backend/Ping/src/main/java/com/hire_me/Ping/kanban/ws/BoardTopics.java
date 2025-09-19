package com.hire_me.Ping.kanban.ws;

public final class BoardTopics {
    private BoardTopics() {}

    public static final String ROOT = "/topic/boards";

    public static String board(Long boardId) {
        return ROOT + "/" + boardId;
    }
}
