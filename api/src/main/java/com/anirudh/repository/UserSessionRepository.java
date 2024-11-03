package com.anirudh.repository;

import com.anirudh.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession,Long> {

    Optional<UserSession> findSessionById(String sessionId);
}
