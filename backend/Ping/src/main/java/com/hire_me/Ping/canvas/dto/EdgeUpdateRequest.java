package com.hire_me.Ping.canvas.dto;

import com.hire_me.Ping.canvas.entity.Edge.EdgeKind;

public class EdgeUpdateRequest {
    private EdgeKind kind;
    private String label;
    private String styleJson;

    public EdgeUpdateRequest() {}

    public EdgeKind getKind() { return kind; }
    public void setKind(EdgeKind kind) { this.kind = kind; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getStyleJson() { return styleJson; }
    public void setStyleJson(String styleJson) { this.styleJson = styleJson; }

}
