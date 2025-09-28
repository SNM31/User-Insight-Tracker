package com.anirudh.controller;

import com.anirudh.dto.AuthRequest;
import com.anirudh.dto.AuthResponse;
import com.anirudh.model.User;
import com.anirudh.service.TokenBlacklistService;
import com.anirudh.service.UserService;
import com.anirudh.utils.JwtUtil;
import com.anirudh.utils.MapperUtil;

import ch.qos.logback.core.subst.Token;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;

import java.net.http.HttpRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MapperUtil mapperUtil;
    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    // @PostMapping("/login")
    // public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest)
    // {
    //     try{
    //         AuthResponse response=userService.login(authRequest);
    //         //
    //         return ResponseEntity.ok()
    //                 .body(response);

    //     }catch (RuntimeException e){
    //         AuthResponse authResponse=AuthResponse.builder()
    //                 .message(e.getMessage())
    //                 .statusCode(HttpStatus.UNAUTHORIZED.value())
    //                 .build();

    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    //                 .body(authResponse);
    //     }
    // }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest authRequest)
    {
        try {
            User user = User.builder()
                    .username(authRequest.getUsername())
                    .password(authRequest.getPassword())
                    .role("ROLE_USER") // Default role, can be modified as needed
                    .build();
            System.out.println(user.getUsername());
            System.out.println(user.getPassword());
            System.out.println(user.getRole());
            AuthResponse response = userService.registerWithUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {

             AuthResponse authResponse=AuthResponse.builder()
                    .message(e.getMessage())
                    .statusCode(HttpStatus.UNAUTHORIZED.value())
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(authResponse);
        }
     }
     @GetMapping("/test")
     public ResponseEntity<String> authenticationTestingEndPoint() {
         return ResponseEntity.ok("Authentication is working fine!");
     }

     @GetMapping("/logout")
     public ResponseEntity<String> logout(HttpServletRequest request) {
        try{
            String token = request.getHeader("Authorization");
            token = token != null ? token.replace("Bearer ", "") : null;
            tokenBlacklistService.blackListToken(token);
            System.out.println("Token blacklisted: " + token);
            return ResponseEntity.ok("Logout successful");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " + e.getMessage());
         }
    }
     @PostMapping("/register/admin")
    public ResponseEntity<AuthResponse> adminRegister(@RequestBody AuthRequest authRequest)
    {
        try {
            User user = User.builder()
                    .username(authRequest.getUsername())
                    .password(authRequest.getPassword())
                    .role("ROLE_ADMIN") // Default role, can be modified as needed
                    .build();
            System.out.println(user.getUsername());
            System.out.println(user.getPassword());
            System.out.println(user.getRole());
            AuthResponse response = userService.registerWithUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {

             AuthResponse authResponse=AuthResponse.builder()
                    .message(e.getMessage())
                    .statusCode(HttpStatus.UNAUTHORIZED.value())
                    .build();

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(authResponse);
        }
     }
}
