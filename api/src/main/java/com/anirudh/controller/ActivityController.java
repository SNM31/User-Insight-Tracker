package com.anirudh.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anirudh.dto.UserActivityDto;
import com.anirudh.model.EventType;
import com.anirudh.model.GeoData;
import com.anirudh.model.User;
import com.anirudh.model.UserActivity;
import com.anirudh.service.ActivityService;
import com.anirudh.service.UserService;
import com.anirudh.utils.IpUtil;

import io.jsonwebtoken.Jwt;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {
    @Autowired
    private ActivityService activityService;
    @Autowired
    private UserService userService;
    @Autowired
    private IpUtil ipUtil;
    @PostMapping("/log")
    public ResponseEntity<String> trackActivity(@RequestBody UserActivityDto userActivityDto,@AuthenticationPrincipal Jwt jwt,
                                             HttpServletRequest request) {
        try {
            String username=jwt.getPayload().toString();
            User user=(User)(userService.loadUserByUsername(username));
            if(user==null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            String clientIp=ipUtil.getClientIp(request);
            

            UserActivity userActivity = getUserActivity(userActivityDto, user, clientIp,
                                        isEventTypeLogin(userActivityDto.getEventType(), clientIp) ?
                                        ipUtil.fetchGeoData(clientIp) : null);
        

             activityService.trackUserActivity(userActivity);
            return ResponseEntity.status(HttpStatus.CREATED).body("Activity logged successfully: " + userActivity.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in Logging activity: " + e.getMessage());
        }
    }
    private UserActivity getUserActivity(UserActivityDto userActivityDto, User user, String clientIp, GeoData geoData) {
        UserActivity userActivity=UserActivity.builder()
        .userId(user.getId())
        .eventType(EventType.valueOf(userActivityDto.getEventType().toUpperCase()))
        .category(userActivityDto.getCategory())
        .subcategory(userActivityDto.getSubcategory())
        .duration(userActivityDto.getDuration())
        .timestamp(userActivityDto.getTimestamp())
        .ipAddress(clientIp)
        .country(geoData != null ? geoData.getCountry_name() : "Unknown")
        .city(geoData != null ? geoData.getCity() : "Unknown")
        .deviceType(userActivityDto.getDeviceinfo())
        .build();
        return userActivity;
    }
    private boolean isEventTypeLogin(String eventType,String clientIp)
    {
        return eventType != null && eventType.equalsIgnoreCase("LOGIN_SUCCESS") && clientIp != null;
    }

}