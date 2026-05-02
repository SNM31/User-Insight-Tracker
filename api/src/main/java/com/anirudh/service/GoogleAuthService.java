package com.anirudh.service;

import com.anirudh.dto.GoogleAuthRequest;
import com.anirudh.model.User;
import com.anirudh.repository.UserRepository;
import com.anirudh.utils.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GoogleAuthService {

    @Autowired
    private GoogleIdTokenVerifier googleIdTokenVerifier;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String authenticate(String idToken) throws GeneralSecurityException, IOException {
        GoogleIdToken.Payload payload = verifyGoogleToken(idToken);
        User user = userRepository.findByEmail(payload.getEmail())
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return jwtUtil.generateDashboardToken(user.getEmail(),user.getRole());
    }

    public String authenticateForInvitation(String googleIdToken, String invitedEmail,String invitedRole) throws GeneralSecurityException, IOException {
        var payload = verifyGoogleToken(googleIdToken);
        if (!payload.getEmail().equalsIgnoreCase(invitedEmail)) {
            throw new IllegalArgumentException("Google account email does not match the invited email.");
        }
        User user = upsertUser(invitedEmail, (String) payload.get("name"), invitedRole);
        return jwtUtil.generateDashboardToken(user.getEmail(), user.getRole());
    }

    private GoogleIdToken.Payload verifyGoogleToken(String token) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = googleIdTokenVerifier.verify(token);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google Token");
        }
        return idToken.getPayload();
    }

    private User upsertUser(String email, String name,String role) {
       return userRepository.findByEmail(email)
       .map(user->{user.setRole(role); return userRepository.save(user);})
       .orElseGet(() -> {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(name != null ? name : email);
        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        newUser.setRole(role);
        return userRepository.save(newUser);
       });
    }
}
