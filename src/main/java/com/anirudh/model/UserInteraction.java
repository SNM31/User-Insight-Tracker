package com.anirudh.model;


// src/main/java/com/example/model/UserInteraction.java


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "user_interactions")
public class UserInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Foreign key referencing the user table

    private String sessionId; // Unique session identifier

    private String interactionType; // e.g., 'click', 'scroll', 'form_submission', etc.

    private String element; // The HTML element that was interacted with (for clicks)

    private String formId; // The ID of the form (for submissions)

    private LocalDateTime timestamp; // When the interaction occurred

    private String url; // The URL of the page where the interaction happened

    private Long duration; // Duration for background time tracking

    private Integer scrollDepth; // Maximum scroll depth reached

    private Integer activeTime; // Active time spent on page

    private Integer idleTime; // Idle time spent without interaction

    private String locationCountry; // Country from which the user is accessing

    private String locationCity; // City from which the user is accessing

    // Getters and Setters
}
