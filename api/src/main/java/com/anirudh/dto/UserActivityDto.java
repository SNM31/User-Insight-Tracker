// src/main/java/com/example/dto/UserInteractionDto.java

package com.anirudh.dto;

import com.anirudh.model.ActivityType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserActivityDto {
    private Long userId; // ID of the user
    private String sessionId; // Unique session identifier
    private ActivityType type; // e.g., click, form_submission, background_time, location
    private String element; // The HTML element that was interacted with (for clicks)
    private String formId; // The ID of the form (for submissions)
    private LocalDateTime timestamp; // When the interaction occurred
    private String url; // The URL of the page where the interaction happened
    private Integer scrollDepth; // Maximum scroll depth reached
    private Long activeTime; // Active time spent on page
    private Long idleTime; // Idle time spent without interaction
    private String locationCountry; // Country from which the user is accessing
    private String locationCity; // City from which the user is accessing
}