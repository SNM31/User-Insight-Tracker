package com.anirudh.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class PowerUserDto {
    private Long userId;
    private String email;
    private Long totalTimeSpent; // in seconds
    private Integer totalSessions;
    private Double averageSessionDuration; // in seconds
    private LocalDate lastActiveDate;
    private String topCategory;
}
