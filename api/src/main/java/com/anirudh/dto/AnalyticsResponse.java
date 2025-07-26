package com.anirudh.dto;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalyticsResponse {
     private int totalUsers;
    private int activeUsers;
    private double averageSessionPerUserPerDay;
    private double averageSessionDuration; // seconds
    private Map<String, Long> topCategoriesVisited;
    private Map<String, Long> topSubcategoriesVisited;

    // General metrics
    private int totalSessions;
    private double averageSessionsPerDay;
    private Map<String, Long> deviceTypeDistribution;
    private Map<String, Long> regionDistribution;
    private Map<String, Long> countryDistribution;
    private Map<Integer, Long> popularLoginHours;
}
