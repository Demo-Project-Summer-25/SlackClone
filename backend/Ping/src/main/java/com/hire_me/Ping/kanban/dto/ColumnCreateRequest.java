package com.hire_me.Ping.kanban.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class ColumnCreateRequest {

    @NotNull
    private UUID boardId;

    @NotBlank
    @Size(max = 140)
    private String name;

    @Min(0)
    private Integer position;

    public UUID getBoardId() {
        return boardId;
    }

    public void setBoardId(UUID boardId) {
        this.boardId = boardId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}
