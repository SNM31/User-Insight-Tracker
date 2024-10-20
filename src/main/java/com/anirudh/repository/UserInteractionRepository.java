package com.anirudh.repository;

import com.anirudh.model.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInteractionRepository extends JpaRepository<UserInteraction,Long> {

}
