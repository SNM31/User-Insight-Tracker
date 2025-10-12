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
@SuppressWarnings("deprecation")
public class JwtUtil {
    @Value("${jwt.secret}")  
    private String jwtSecret;

    @Value("${jwt.expiration}") 
    private long jwtExpiration;

    @Value("${jwt.dashboard.secret}")
    private String dashboardJwtSecret;

    private Key secretKey;
    private Key dashboardSecretKey;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.dashboardSecretKey = Keys.hmacShaKeyFor(dashboardJwtSecret.getBytes(StandardCharsets.UTF_8));
    }

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

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

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
    
    public String generateDashboardToken(String emailId,String role){
        HashMap<String,String> claims=new HashMap<>();
        claims.put("role", role);
        claims.put("scope", "dashboard_access");
        return Jwts.builder()
                .setSubject(emailId)
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 24*60*60*1000)) // 24 hours
                .signWith(dashboardSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }
    public String validateAndExtractEmailForDashboard(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(dashboardSecretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Check for the specific claim to ensure it's a dashboard token
            if (!"dashboard_access".equals(claims.get("scope"))) {
                return null; // Not a valid dashboard token
            }

            return claims.getSubject();
        } catch (JwtException e) {
            System.out.println("Invalid Dashboard JWT Token: " + e.getMessage());
            return null; // Invalid or expired JWT
        }
    }
}
