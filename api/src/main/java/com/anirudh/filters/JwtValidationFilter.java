package com.anirudh.filters;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.CacheProperties.Redis;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.anirudh.service.TokenBlacklistService;
import com.anirudh.token.JwtAuthenticationToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

public class JwtValidationFilter extends OncePerRequestFilter {
    
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;
    public JwtValidationFilter(AuthenticationManager authenticationManager, TokenBlacklistService tokenBlacklistService) {
        this.tokenBlacklistService = tokenBlacklistService;
        this.authenticationManager=authenticationManager;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Implement JWT validation logic here
        String token = extractJwtToken(request);
        System.out.println("Token extracted: " + token);
        if(token!=null){
            JwtAuthenticationToken authToken= new JwtAuthenticationToken(token);
            Authentication authResult=authenticationManager.authenticate(authToken);
            if(!tokenBlacklistService.isTokenBlacklisted(token) && authResult.isAuthenticated()){
                System.out.println("JWT Token is valid for user: " + authResult.getName());
                SecurityContextHolder.getContext().setAuthentication(authResult);
            }
            else {
                System.out.println("JWT Token is invalid");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token");
                return;
            }
        }
        
         filterChain.doFilter(request, response);
    }
    
    private String extractJwtToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
