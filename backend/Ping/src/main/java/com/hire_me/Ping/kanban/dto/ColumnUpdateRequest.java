package com.hire_me.Ping.kanban.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class ColumnUpdateRequest {

    @Size(max = 140)
    private String name;

    @Min(0)
    private Integer position;

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
