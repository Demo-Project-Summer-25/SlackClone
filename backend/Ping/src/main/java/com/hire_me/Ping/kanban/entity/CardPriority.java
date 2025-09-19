package com.hire_me.Ping.kanban.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "card_priority", uniqueConstraints = {
    @UniqueConstraint(name = "uq_priority_key", columnNames = "priority_key")
})
public class CardPriority {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "priority_key", nullable = false, length = 32)
    private String key;

    @Column(nullable = false, length = 80)
    private String label;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "color_hex", length = 8)
    private String colorHex;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getColorHex() {
        return colorHex;
    }

    public void setColorHex(String colorHex) {
        this.colorHex = colorHex;
    }
}
