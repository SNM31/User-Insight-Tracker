package com.anirudh.service;

import com.anirudh.dto.UserActivityDto;
import com.anirudh.model.UserActivity;
import com.anirudh.repository.UserActivityRepository;
import com.anirudh.utils.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserActivityServiceImpl implements UserActivityService {
    @Autowired
    private UserActivityRepository userActivityRepository;
    @Autowired
    private MapperUtil mapperUtil;

    @Override
    public void processUserActivity(UserActivityDto userActivityDto)
    {
        UserActivity userActivity=mapperUtil.convertToEntity(userActivityDto,UserActivity.class);
        userActivityRepository.save(userActivity);
    }
}
