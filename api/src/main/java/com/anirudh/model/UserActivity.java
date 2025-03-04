package com.anirudh.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_activities", indexes = {
    @Index(name = "idx_user_activities_session", columnList = "session_id"),
    @Index(name = "idx_user_activities_timestamp", columnList = "timestamp"),
    @Index(name = "idx_user_activities_type", columnList = "type"),
    @Index(name = "idx_user_activities_url", columnList = "url")
})
public class UserActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String sessionId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ActivityType type;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String url;
    
    private String previousUrl;
    private String nextUrl;

    // Element interaction
    private String element;
    private String elementId;
    
    // Form tracking
    private String formId;
    private String formData;    // Consider JSON column type
    
    // Search and Filter
    private String searchQuery;
    private String filterApplied;
    
    // Success tracking
    private Boolean successful;
    private String errorMessage;
    
    // Time tracking
    private Long activeTime;    // in milliseconds
    private Long timeOnPage;    // in milliseconds
    
    // Device info
    private String deviceInfo;
    
    // Location
    private String locationCountry;
    private String locationCity;
}