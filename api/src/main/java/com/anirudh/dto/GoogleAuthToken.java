package com.anirudh.dto;
import lombok.Data;

@Data
public class GoogleAuthToken {
    private String idToken; // The ID token received from Google after user authentication
}