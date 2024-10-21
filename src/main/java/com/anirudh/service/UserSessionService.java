package com.anirudh.service;

import com.anirudh.model.User;
import com.anirudh.model.UserSession;
import com.anirudh.repository.UserSessionRepository;
import com.anirudh.utils.CookieUtil;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserSessionService {
    @Autowired
    private UserSessionRepository userSessionRepository;
    @Autowired
    private CookieUtil cookieUtil;

    public UserSession createSession(User user){
        UserSession session=new UserSession();
        session.setUser(user);
        session.setSessionId(UUID.randomUUID().toString());
        session.setCreatedAt(LocalDateTime.now());
        session.setLastAccessedAt(LocalDateTime.now());
        session.setDuration(0L);
        return userSessionRepository.save(session);
    }
    public void updateLastAccessed(String sessionId)
    {
        UserSession session=new UserSession();
    }
}
