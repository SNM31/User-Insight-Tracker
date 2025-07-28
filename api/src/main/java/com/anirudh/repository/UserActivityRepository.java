package com.anirudh.repository;

import com.anirudh.model.EventType;
import com.anirudh.model.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity,Long>,JpaSpecificationExecutor<UserActivity> {
    public UserActivity findByEventTypeAndUserId(EventType eventType, Long userId);
}
