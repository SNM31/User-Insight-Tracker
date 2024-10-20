package com.anirudh.service;

import com.anirudh.model.UserInteraction;
import com.anirudh.repository.UserInteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserInteractionService {
    @Autowired
    private UserInteractionRepository repository;

    public void saveInteraction(UserInteraction userInteraction){
        repository.save(userInteraction);
    }
}
