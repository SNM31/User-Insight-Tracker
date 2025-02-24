package com.anirudh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;        // The generated JWT token
    private String username;     // The username of the authenticated user
    private String message;      // Success or error message
    private int statusCode;      // HTTP status code
    private String cookie;
}