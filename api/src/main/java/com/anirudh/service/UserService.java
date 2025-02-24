package com.anirudh.service;

import com.anirudh.dto.AuthRequest;
import com.anirudh.dto.AuthResponse;
import com.anirudh.repository.UserRepository;
import com.anirudh.utils.JwtUtil;
import com.anirudh.utils.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.anirudh.model.User;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private MapperUtil mapperUtil;
    @Autowired
    private UserSessionService userSessionService;

    public AuthResponse login(AuthRequest authRequest) {
        // Check if username exists
        User user = userRepository.findByUsername(authRequest.getUsername());
        if (user == null) {
            throw new RuntimeException("User does not exist. Please register first.");
        }

        // Verify password
        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password. Please try again.");
        }

        // Generate token and session
        String token = jwtUtil.generateToken(user.getUsername());
        ResponseCookie cookie = userSessionService.createSessionAndGetCookie(user);
        return new AuthResponse(token, user.getUsername(), "Login successful", HttpStatus.OK.value(), cookie.toString());
    }

    public AuthResponse registerWithUser(AuthRequest authRequest) {
        // Validate username
        if (authRequest.getUsername() == null || authRequest.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username cannot be empty");
        }

        // Check if username already exists
        if (userRepository.findByUsername(authRequest.getUsername()) != null) {
            throw new RuntimeException("Username already exists. Please choose a different username.");
        }

        // Validate password
        if (authRequest.getPassword() == null || authRequest.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        User user = mapperUtil.convertToEntity(authRequest, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return new AuthResponse(null, user.getUsername(), "Registration successful", HttpStatus.CREATED.value(), null);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
