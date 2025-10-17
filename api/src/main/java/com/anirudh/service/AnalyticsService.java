package com.anirudh.service;

import com.anirudh.dto.AnalyticsResponse;
import com.anirudh.dto.MetricsFilterRequest;
import com.anirudh.dto.PowerUserDto;
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
    private static final int ACTIVE_USER_WINDOW_MINUTES = 5;

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
        Map<Long,List<UserActivity>> categoriesVisited=events
                                               .stream()
                                               .collect((Collectors.groupingBy(UserActivity::getUserId)));

        return AnalyticsResponse.builder()
                .totalSessions(sessionIds.size())
                .totalTimeSpent(totalTimeSpent)
                .averageSessionDuration(avgSessionDuration)
                .lastActiveDate(lastActiveDate)
                .topCategoriesVisited(groupCount(categoriesVisited, UserActivity::getCategory))
                .topSubcategoriesVisited(groupCount(categoriesVisited, UserActivity::getSubcategory))
                .deviceTypeDistribution(groupCount(categoriesVisited, UserActivity::getDeviceType))
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
        double bounceRate = (double) calculateBouncedEvents(events) / Math.max(1, sessionIds.size()) * 100;
         Map<Long,List<UserActivity>> categoriesVisited=events
                                               .stream()
                                               .collect((Collectors.groupingBy(UserActivity::getUserId)));
        List<PowerUserDto> potentialPowerUsers=getPowerUsers(events);
        potentialPowerUsers.sort((u1, u2) -> Long.compare(u2.getTotalSessions(), u1.getTotalSessions()));
        potentialPowerUsers=potentialPowerUsers.stream().limit((int)Math.max(1,potentialPowerUsers.size()*0.05)).collect(Collectors.toList());                                       

        return AnalyticsResponse.builder()
                .totalUsers(userIds.size())
                .activeUsers(activeUsers)
                .totalSessions(sessionIds.size())
                .averageSessionDuration(avgSessionDuration)
                .averageSessionsPerDay(avgSessionsPerDay)
                .topCategoriesVisited(groupCount(categoriesVisited, UserActivity::getCategory))
                .topSubcategoriesVisited(groupCount(categoriesVisited, UserActivity::getSubcategory))
                .deviceTypeDistribution(groupCount(categoriesVisited, UserActivity::getDeviceType))
                // .regionDistribution(groupCount(events, UserActivity::getRegion))
                .countryDistribution(groupCount(categoriesVisited, UserActivity::getCountry))
                .loginActivityByHour(getLoginActivityByHour(events))
                .bounceRate(bounceRate)
                .powerUsers(potentialPowerUsers)
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
            .filter(event -> event.getEventType() == EventType.SESSION_DURATION)
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
        final LocalDateTime cutoff = LocalDateTime.now().minusMinutes(ACTIVE_USER_WINDOW_MINUTES);
        return (int) events.stream()
                .filter(e -> e.getTimestamp() != null && e.getTimestamp().isAfter(cutoff))
                .map(UserActivity::getUserId)
                .filter(Objects::nonNull)
                .distinct()
                .count();
    }

    private <T> Map<String, Long> groupCount(Map<Long, List<UserActivity>> events, 
                                       java.util.function.Function<UserActivity, T> groupingKey) {
    
    return events.values().stream()
                    .flatMap(userActivityList -> userActivityList.stream()
                    .map(groupingKey)
                    .filter(Objects::nonNull)
                    .distinct())
                    .map(Object::toString)
                    .map(String::toLowerCase)
                    .distinct()
                    .collect(Collectors.groupingBy(key -> key, Collectors.counting()));
    }
    private int calculateBouncedEvents(List<UserActivity> events) {
        Map<String, List<UserActivity>> sessions = 
                    events.stream()
                    .filter(e -> e.getSessionId() != null)
                    .collect(Collectors.groupingBy(UserActivity::getSessionId));
         return (int) sessions.values().stream()
                    .filter(e->e.size()<=2)
                    .count();       
    }

    private List<PowerUserDto> getPowerUsers(List<UserActivity> events) {
        Map<Long,List<UserActivity>> userEvents= events.stream()
               .filter(e->e.getUserId()!=null)
               .collect(Collectors.groupingBy(UserActivity::getUserId));

        List<PowerUserDto> powerUsers=userEvents.entrySet().stream()
               .map(
                entry->{
                    List<UserActivity> activities=entry.getValue();
                    PowerUserDto dto=PowerUserDto.builder()
                    .userId(entry.getKey())
                    .totalTimeSpent(getTotalDuration(activities))
                    .totalSessions(getUniqueSessionIds(activities).size())
                    .averageSessionDuration(getAverageSessionDuration(getUniqueSessionIds(activities), getTotalDuration(activities)))
                    .lastActiveDate(getLastActiveDate(activities))
                    .build();
                    
                    return dto;
               }).collect(Collectors.toList());   

        return powerUsers;
    }

  
}
