package com.anirudh.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
public class AuthRequest {
    private String username; // Username entered by the user during login
    private String password; // Password entered by the user during login
}