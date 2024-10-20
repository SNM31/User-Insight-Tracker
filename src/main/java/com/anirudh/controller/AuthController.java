package com.anirudh.controller;

import com.anirudh.dto.AuthRequest;
import com.anirudh.dto.AuthResponse;
import com.anirudh.service.UserService;
import com.anirudh.utils.JwtUtil;
import com.anirudh.utils.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.anirudh.model.User;

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

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest)
    {
//       User user=userService.findByUsername(authRequest.getUsername());
//       if(user==null){
//           AuthResponse response = new AuthResponse(null, null, "Error: Invalid Username", HttpStatus.UNAUTHORIZED.value());
//           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//       }
//       if(passwordEncoder.matches(authRequest.getPassword(), user.getPassword()))
//       {
//           String token= jwtUtil.generateToken(user.getUsername());
//           AuthResponse response = new AuthResponse(token, user.getUsername(), "Success", HttpStatus.OK.value());
//           return ResponseEntity.ok(response); // Send success response
//       }
//       else{
//           AuthResponse response = new AuthResponse(null, null, "Error: Invalid Password", HttpStatus.UNAUTHORIZED.value());
//           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//       }
        try{
            AuthResponse response=userService.login(authRequest);
            return ResponseEntity.ok().body(response);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(null,null, e.getMessage(), HttpStatus.UNAUTHORIZED.value()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest authRequest)
    {
        try {
            AuthResponse response = userService.registerWithUser(authRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(null, null, e.getMessage(),HttpStatus.UNAUTHORIZED.value()));
        }
    }
}
