package com.anirudh.model;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity")
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                // Unique identifier for each activity record

    @Column(name = "user_id", nullable = false)
    private Long userId;            // Foreign key referencing the user table

    @Column(name = "session_id", nullable = false)
    private String sessionId;       // Unique identifier for the session

    @Column(name = "activity_type", nullable = false)
    private String activityType;     // Type of activity (e.g., click, scroll)

    @Column(name = "element_id")
    private String elementId;        // ID of the HTML element interacted with

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp; // When the activity occurred

    @Column(name = "url")
    private String url;              // The URL of the page where the interaction happened

    @Column(name = "scroll_depth")
    private Integer scrollDepth;     // Maximum scroll depth reached (if applicable)

    @Column(name = "active_time")
    private Integer activeTime;      // Active time spent on page (in seconds)

    @Column(name = "idle_time")
    private Integer idleTime;        // Idle time spent without interaction (in seconds)

    @Column(name = "location_country")
    private String locationCountry;   // Country from which the user is accessing

    @Column(name = "location_city")
    private String locationCity;      // City from which the user is accessing

    // New fields for additional metrics
    @Column(name = "previous_page_url")
    private String previousPageUrl;   // URL of the previous page

    @Column(name = "current_page_url")
    private String currentPageUrl;   // URL of the current page

    @Column(name = "tab_switch_count")
    private Integer tabSwitchCount;   // Count of tab switches during the
}