package com.anirudh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.anirudh.dto.UserActivityDto;
import com.anirudh.model.UserActivity;
import com.anirudh.repository.UserActivityRepository;
import com.anirudh.utils.MapperUtil;

@Service
public class ActivityService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    public UserActivity trackUserActivity(UserActivity userActivity) {
       return userActivityRepository.save(userActivity);
    }
    
}
