package com.anirudh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Lombok annotation to generate constructor with parameters
public class AuthResponse {
    private String token;        // The generated JWT token
    private String username;     // The username of the authenticated user
    private String message;      // Success or error message
    private int statusCode;      // HTTP status code
    private String cookie;
}