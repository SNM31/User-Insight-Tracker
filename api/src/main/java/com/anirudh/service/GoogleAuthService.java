package com.anirudh.service;

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
        User user = verifyAndGetUserFromGoogleToken(idToken);

        List<GrantedAuthority> authorities = user.getAuthorities().stream().collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);

        return jwtUtil.generateDashboardToken(user.getEmail(),user.getRole());
    }

    public String authenticateForInvitation(String token, String invitedEmail) throws GeneralSecurityException, IOException {
        User user = verifyAndGetUserFromGoogleToken(token);

        if (!user.getEmail().equalsIgnoreCase(invitedEmail)) {
            throw new IllegalArgumentException("Google account email does not match the invited email.");
        }

        List<GrantedAuthority> authorities = user.getAuthorities().stream().collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);
        
        return jwtUtil.generateDashboardToken(user.getEmail(),user.getRole());
    }
    private User verifyAndGetUserFromGoogleToken(String token) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = googleIdTokenVerifier.verify(token);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google Token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        return findOrCreateUser(email, name);
    }

    private User findOrCreateUser(String email, String name) {
        return userRepository.findByEmail(email)
        
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(name != null ? name : email);
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    newUser.setRole("ROLE_ADMIN");
                    return userRepository.save(newUser);
                });
    }
}