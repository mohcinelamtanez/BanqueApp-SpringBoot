package com.mohcine.banqueApp.entity;

import com.mohcine.banqueApp.enums.NotificationType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * @author USER
 **/
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id ;
    @Column
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column
    private boolean read ;
    @Column
    private LocalDateTime createdAt;

    @ManyToOne
    private User user;

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


