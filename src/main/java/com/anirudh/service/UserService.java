package com.anirudh.service;

import com.anirudh.dto.AuthRequest;
import com.anirudh.dto.AuthResponse;
import com.anirudh.repository.UserRepository;
import com.anirudh.utils.JwtUtil;
import com.anirudh.utils.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
        User user = userRepository.findByUsername(authRequest.getUsername());

        if (user == null) {
            throw new RuntimeException("Invalid Username");
        }

        if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            ResponseCookie cookie=userSessionService.createSessionAndGetCookie(user);
            return new AuthResponse(token, user.getUsername(), "Success", HttpStatus.OK.value(), cookie.toString());
        } else {
            throw new RuntimeException("Invalid Password");
        }
    }

    public AuthResponse registerWithUser(AuthRequest authRequest)
    {
        if (userRepository.findByUsername(authRequest.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }
        User user= mapperUtil.convertToEntity(authRequest, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return new AuthResponse(null, user.getUsername(),"Registered Successfully",HttpStatus.CREATED.value(),null);
    }
    public User findByUsername(String username)
    {
        return userRepository.findByUsername(username);
    }

}
