package com.anirudh.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.anirudh.dto.AnalyticsResponse;
import com.anirudh.dto.MetricsFilterRequest;
import com.anirudh.repository.UserActivityRepository;

@Service
public class AnalyticsService {
    // This service will handle the business logic for analytics
    // It will interact with the database or any other data source to fetch metrics
    private UserActivityRepository repository;

    public AnalyticsResponse getAnalytics(LocalDateTime startDate, LocalDateTime endDate,
                                                String region, String deviceType) {
        return repository.getUserAnalytics(startDate, endDate, region, deviceType);
    }
    
}
