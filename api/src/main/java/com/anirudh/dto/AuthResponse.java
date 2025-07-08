package com.anirudh.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String token;        // The generated JWT token
    private String username;     // The username of the authenticated user
    private String message;      // Success or error message
    private int statusCode;      // HTTP status code
}