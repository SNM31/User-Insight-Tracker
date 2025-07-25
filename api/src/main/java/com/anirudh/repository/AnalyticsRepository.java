package com.anirudh.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anirudh.dto.MetricsFilterRequest;
@Repository
public interface AnalyticsRepository extends  JpaRepository<UserActivity,Long> {
    // This repository will handle database interactions for analytics data
    // You can define custom query methods here if needed

    // Example: Find analytics by userId
    // List<Analytics> findByUserId(Long userId);
    
    // Example: Find analytics by date range
    // List<Analytics> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
}
