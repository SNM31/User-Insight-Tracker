package com.anirudh.dto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.time.LocalDate;
import java.util.*;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@Data
public class AnalyticsResponse {

    // Common
    private Integer totalSessions;
    private Double averageSessionDuration; // in seconds
    private Map<String, Long> topCategoriesVisited;
    private Map<String, Long> topSubcategoriesVisited;
    private Map<String, Long> deviceTypeDistribution;
    private Map<Integer, Long> loginActivityByHour;
    private double bounceRate;

    // General-only
    private Integer totalUsers;
    private Integer activeUsers;
    private Double averageSessionsPerDay;
    // private Map<String, Long> regionDistribution;
    private Map<String, Long> countryDistribution;

    // User-specific-only
    private Long totalTimeSpent;          // total time spent (sum of durations)
    private LocalDate lastActiveDate;
}
