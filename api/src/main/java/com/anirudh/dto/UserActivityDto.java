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
    private String url; // The URL of the page where the interaction happened
    private String previousUrl;
    private String nextUrl;
    
    // Element interaction
    private String element;
    private String elementId;
    
    // Form tracking
    private String formId;
    private String formData;
    
    // Search and Filter
    private String searchQuery;
    private String filterApplied;
    
    // Success tracking
    private Boolean successful;
    private String errorMessage;
    
    // Time tracking
    private Long activeTime;
    private Long timeOnPage;
    
    // Device info
    private String deviceInfo;
    
    // Location
    private String locationCountry;
    private String locationCity;
    
    // Timestamp will be set server-side if not provided
    private LocalDateTime timestamp;
}