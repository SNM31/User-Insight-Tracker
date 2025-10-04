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
    // // Validate JWT token
    // @SuppressWarnings("deprecation")
    // public boolean validateJwtToken(String token) {
    //     try {
    //         Jwts.parser().setSigningKey(secretKey).build().parseClaimsJws(token);
    //         return true;
    //     } catch (SecurityException e) {
    //         System.out.println("Invalid JWT signature: " + e.getMessage());
    //     } catch (MalformedJwtException e) {
    //         System.out.println("Invalid JWT token: " + e.getMessage());
    //     } catch (ExpiredJwtException e) {
    //         System.out.println("JWT token is expired: " + e.getMessage());
    //     } catch (UnsupportedJwtException e) {
    //         System.out.println("JWT token is unsupported: " + e.getMessage());
    //     } catch (IllegalArgumentException e) {
    //         System.out.println("JWT claims string is empty: " + e.getMessage());
    //     }
    //     return false;
    // }
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
    @SuppressWarnings("deprecation")
    public String generateInvitationToken(String userName,String email,String role)
    {
        try{
           HashMap<String,String> claims=new HashMap<>();
           claims.put("role", role);
           claims.put("scope", "Invite");
           return Jwts.builder()
                .setSubject(userName)
                .addClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
        }catch(Exception e){
         System.out.println("Invalid JWT Token: " + e.getMessage());
         return "Not Able to Create token";
        }
    }

}
