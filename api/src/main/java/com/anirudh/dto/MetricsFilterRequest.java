package com.anirudh.dto;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class MetricsFilterRequest {

    private String country;
    private String city;
    private String deviceType;

    // Example: MOBILE, DESKTOP, TABLET
    private String platform;

    // Optional: Filter by userId (only if you want individual user metrics)
    private Long userId;

    // Filter by session or group metrics per session
    private String sessionId;

    // Optional region-level grouping
    private String region;

    // Used for date range filtering (start and end)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

}
