package com.anirudh.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
// import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")  
    private String jwtSecret;

    @Value("${jwt.expiration}") 
    private long jwtExpiration;

    private Key secretKey;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    @SuppressWarnings("deprecation")
    public String generateToken(String userName,String role){
        HashMap<String,String> claims=new HashMap<>();
        claims.put("role", role);
        return Jwts.builder()
                .setSubject(userName)
                .addClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
    @SuppressWarnings("deprecation")
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    @SuppressWarnings("deprecation")
     public String validateAndExtractUsername(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException e) {
            System.out.println("Invalid JWT Token: " + e.getMessage());
            return null; // Invalid or expired JWT
        }
    }
    @SuppressWarnings("deprecation")
    public long getExpirationFromToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration()
                    .getTime();
        } catch (JwtException e) {
            System.out.println("Invalid JWT Token: " + e.getMessage());
            return 0; // Invalid or expired JWT
        }
    }
}
