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

    public String authenticate(String token,String userEmailId) throws GeneralSecurityException, IOException {
        // 1. Verify the Google ID token
        GoogleIdToken idToken = googleIdTokenVerifier.verify(token);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid Google Token");
        }

        // 2. Extract user info
        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        if(!email.equals(userEmailId))
        {
            throw new IllegalArgumentException("Google account email does not match the invited email.");
        }

        // 3. Find or create user
        User user = findOrCreateUser(email, name);

        // 4. Create Authentication object
        List<GrantedAuthority> authorities = user.getAuthorities().stream().collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);

        // 5. Generate and return the application's JWT
        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    private User findOrCreateUser(String email, String name) {
        return userRepository.findByEmail(email)
        
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(name != null ? name : email);
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    newUser.setRole("ROLE_USER");
                    return userRepository.save(newUser);
                });
    }
}