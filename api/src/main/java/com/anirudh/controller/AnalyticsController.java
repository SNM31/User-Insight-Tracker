package com.anirudh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anirudh.dto.AnalyticsResponse;
import com.anirudh.dto.MetricsFilterRequest;
import com.anirudh.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/analytics")
// @RequiredArgsConstructor
public class AnalyticsController {
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public AnalyticsResponse getMetrics(@ModelAttribute MetricsFilterRequest filterRequest) {
        return analyticsService.getAnalytics(filterRequest);
    }
}