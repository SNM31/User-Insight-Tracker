package com.anirudh.service;

import com.anirudh.dto.UserActivityDto;
import com.anirudh.model.User;
import com.anirudh.model.UserActivity;
import com.anirudh.repository.UserActivityRepository;
import com.anirudh.repository.UserRepository;
import com.anirudh.utils.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class UserActivityServiceImpl implements UserActivityService {
    @Autowired
    private UserActivityRepository activityRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MapperUtil mapperUtil;

    @Override
    public void processUserActivity(UserActivityDto activityDto) {
        User user = userRepository.findById(activityDto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserActivity activity = mapperUtil.convertToEntity(activityDto, UserActivity.class);
        activity.setUser(user);
        
        if (activity.getTimestamp() == null) {
            activity.setTimestamp(LocalDateTime.now());
        }

        activityRepository.save(activity);
    }
}
