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

        if (activity.getType() == ActivityType.FORM_SUBMIT || 
            activity.getType() == ActivityType.FORM_START || 
            activity.getType() == ActivityType.FORM_ABANDON) {
            validateFormData(activity);
        }

        if (activity.getType() == ActivityType.SEARCH || 
            activity.getType() == ActivityType.FILTER_USE) {
            validateSearchFilterData(activity);
        }

        activityRepository.save(activity);
    }

    private void validateFormData(UserActivity activity) {
        if (activity.getFormId() == null) {
            throw new IllegalArgumentException("Form ID is required for form activities");
        }
    }

    private void validateSearchFilterData(UserActivity activity) {
        if (activity.getType() == ActivityType.SEARCH && activity.getSearchQuery() == null) {
            throw new IllegalArgumentException("Search query is required for search activities");
        }
        if (activity.getType() == ActivityType.FILTER_USE && activity.getFilterApplied() == null) {
            throw new IllegalArgumentException("Filter data is required for filter activities");
        }
    }
}
