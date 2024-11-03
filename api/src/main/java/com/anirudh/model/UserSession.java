package com.anirudh.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "user_sessions")
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // Assuming a user can have many sessions
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String sessionId; // Unique session identifier
    private LocalDateTime createdAt; // When the session was created
    private LocalDateTime lastAccessedAt; // Last time the session was accessed
    private Long duration; // Duration of the session in seconds

}