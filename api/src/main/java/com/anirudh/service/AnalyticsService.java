package com.anirudh.service;

import com.anirudh.dto.AnalyticsResponse;
import com.anirudh.dto.MetricsFilterRequest;
import com.anirudh.model.EventType;
import com.anirudh.model.UserActivity;
import com.anirudh.repository.UserActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.anirudh.helper.UserActivitySpecifications.withFilters;

@Service
public class AnalyticsService {

    private final UserActivityRepository repository;

    public AnalyticsService(UserActivityRepository repository) {
        this.repository = repository;
    }

    public AnalyticsResponse getAnalytics(MetricsFilterRequest filter) {
        List<UserActivity> events = repository.findAll(withFilters(filter));
        return filter.getUserId() != null
                ? buildUserAnalytics(events)
                : buildGeneralAnalytics(events, filter);
    }

    // =================== User Profile Metrics ===================

    
    private AnalyticsResponse buildUserAnalytics(List<UserActivity> events) {
        Set<String> sessionIds = getUniqueSessionIds(events);
        long totalTimeSpent = getTotalDuration(events);
        double avgSessionDuration = getAverageSessionDuration(sessionIds, totalTimeSpent);
        LocalDate lastActiveDate = getLastActiveDate(events);

        return AnalyticsResponse.builder()
                .totalSessions(sessionIds.size())
                .totalTimeSpent(totalTimeSpent)
                .averageSessionDuration(avgSessionDuration)
                .lastActiveDate(lastActiveDate)
                .topCategoriesVisited(groupCount(events, UserActivity::getCategory))
                .topSubcategoriesVisited(groupCount(events, UserActivity::getSubcategory))
                .deviceTypeDistribution(groupCount(events, UserActivity::getDeviceType))
                .loginActivityByHour(getLoginActivityByHour(events))
                .build();
    }

    // =================== General Metrics ===================

    private AnalyticsResponse buildGeneralAnalytics(List<UserActivity> events, MetricsFilterRequest filter) {
        Set<Long> userIds = getUniqueUserIds(events);
        Set<String> sessionIds = getUniqueSessionIds(events);
        long totalTimeSpent = getTotalDuration(events);
        double avgSessionDuration = getAverageSessionDuration(sessionIds, totalTimeSpent);
        double avgSessionsPerDay = getAverageSessionsPerDay(sessionIds.size(), filter);
        int activeUsers = countActiveUsers(events);

        return AnalyticsResponse.builder()
                .totalUsers(userIds.size())
                .activeUsers(activeUsers)
                .totalSessions(sessionIds.size())
                .averageSessionDuration(avgSessionDuration)
                .averageSessionsPerDay(avgSessionsPerDay)
                .topCategoriesVisited(groupCount(events, UserActivity::getCategory))
                .topSubcategoriesVisited(groupCount(events, UserActivity::getSubcategory))
                .deviceTypeDistribution(groupCount(events, UserActivity::getDeviceType))
                // .regionDistribution(groupCount(events, UserActivity::getRegion))
                .countryDistribution(groupCount(events, UserActivity::getCountry))
                .loginActivityByHour(getLoginActivityByHour(events))
                .build();
    }

    // =================== Reusable Helper Methods ===================

    private Set<String> getUniqueSessionIds(List<UserActivity> events) {
        return events.stream()
                .map(UserActivity::getSessionId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private Set<Long> getUniqueUserIds(List<UserActivity> events) {
        return events.stream()
                .map(UserActivity::getUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private long getTotalDuration(List<UserActivity> events) {
        return events.stream()
                .map(UserActivity::getDuration)
                .filter(Objects::nonNull)
                .mapToLong(Integer::intValue)
                .sum();
    }

    private double getAverageSessionDuration(Set<String> sessionIds, long totalDuration) {
        return sessionIds.isEmpty() ? 0 : (double) totalDuration / sessionIds.size();
    }

    private LocalDate getLastActiveDate(List<UserActivity> events) {
        return events.stream()
                .map(UserActivity::getTimestamp)
                .filter(Objects::nonNull)
                .max(LocalDateTime::compareTo)
                .map(LocalDateTime::toLocalDate)
                .orElse(null);
    }

    private Map<Integer, Long> getLoginActivityByHour(List<UserActivity> events) {
        return events.stream()
                .filter(e -> e.getEventType() == EventType.LOGIN_SUCCESS && e.getTimestamp() != null)
                .map(e -> e.getTimestamp().getHour())
                .collect(Collectors.groupingBy(hour -> hour, Collectors.counting()));
    }

    private double getAverageSessionsPerDay(int totalSessions, MetricsFilterRequest filter) {
        if (filter.getStartDate() != null && filter.getEndDate() != null) {
            long days = Math.max(1, filter.getStartDate().until(filter.getEndDate()).getDays() + 1);
            return (double) totalSessions / days;
        }
        return 0;
    }

    private int countActiveUsers(List<UserActivity> events) {
        return (int) events.stream()
                .filter(e -> e.getEventType() == EventType.LOGIN_SUCCESS ||
                             e.getEventType() == EventType.SESSION_DURATION)
                .map(UserActivity::getUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet())
                .size();
    }

    private <T> Map<String, Long> groupCount(List<UserActivity> events, java.util.function.Function<UserActivity, T> groupingKey) {
        return events.stream()
                .map(groupingKey)
                .filter(Objects::nonNull)
                .map(Object::toString)
                 .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
    }
}
