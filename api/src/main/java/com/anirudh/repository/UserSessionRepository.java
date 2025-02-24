package com.anirudh.repository;

import com.anirudh.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession,Long> {

    @Query("SELECT s FROM UserSession s WHERE s.sessionId = :sessionId")
    Optional<UserSession> findSessionById(@Param("sessionId") String sessionId);
}
