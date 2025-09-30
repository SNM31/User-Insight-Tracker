package com.anirudh.filters;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.anirudh.model.User;
import com.anirudh.service.UserService;
import com.anirudh.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    public JwtAuthenticationFilter(JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if(!request.getServletPath().equals("/api/auth/login")){
            filterChain.doFilter(request, response); // Continue the filter chain for other requests
            return; 
        }
        System.out.println("JWT Authentication Filter triggered for login request");
        ObjectMapper mapper = new ObjectMapper();
        User user=mapper.readValue(request.getInputStream(), User.class);
        System.out.println("Username in Authentication Filter: " + user.getUsername());
        UsernamePasswordAuthenticationToken autToken= new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        Authentication authentication= authenticationManager.authenticate(autToken);
        if(authentication.isAuthenticated()){
            System.out.println("User authenticated successfully: " + user.getUsername());
            String role=authentication.getAuthorities().iterator().next().getAuthority();
            System.out.println("User role: " + role);
            String token = jwtUtil.generateToken(user.getUsername(),role);
            response.setHeader("Authorization", "Bearer " + token);
            // SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
        }
        return;
    }
}