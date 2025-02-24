package com.anirudh.service;

import com.anirudh.model.User;
import com.anirudh.model.UserSession;
import com.anirudh.repository.UserSessionRepository;
import com.anirudh.utils.CookieUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
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
        UserSession session=userSessionRepository.findSessionById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session Not found"));
        session.setLastAccessedAt(LocalDateTime.now());
        userSessionRepository.save(session);
    }
    public void terminateSession(String sessionId)
    {
        UserSession session = userSessionRepository.findSessionById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session Not found"));
        userSessionRepository.delete(session);
    }
    public ResponseCookie getSessionCookie(String sessionId)
    {
        return cookieUtil.createSessionCookie(sessionId);
    }
    public ResponseCookie createSessionAndGetCookie(User user)
    {
        return getSessionCookie(createSession(user).getSessionId());
    }
}
