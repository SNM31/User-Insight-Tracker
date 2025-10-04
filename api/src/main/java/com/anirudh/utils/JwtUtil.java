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
    @Value("${jwt.invitation.secret}")
    private String jwtInvitationSecret;

    @Value("${jwt.expiration}") 
    private long jwtExpiration;

    private Key secretKey;
    private Key invitationSecretKey;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.invitationSecretKey = Keys.hmacShaKeyFor(jwtInvitationSecret.getBytes(StandardCharsets.UTF_8));
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
    public String generateInvitationToken(String email,String role)
    {
        try{
           HashMap<String,String> claims=new HashMap<>();
           claims.put("role", role);
           claims.put("scope", "Invite");
           return Jwts.builder()
                .setSubject(email)
                .addClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(invitationSecretKey, SignatureAlgorithm.HS256)
                .compact();
        }catch(Exception e){
         throw new RuntimeException("Could not create invitation token", e);
        }
    }
      @SuppressWarnings("deprecation")
     public String validateAndExtractEmail(String token) {
        try {
            Claims claims= Jwts.parser()
                    .setSigningKey(invitationSecretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String scope=claims.get("scope",String.class);
            if(scope==null || !scope.equals("Invite"))
            {
                throw new RuntimeException("Invalid scope for invitation token");
            }
            return claims.getSubject();        
        } catch (JwtException e) {
            throw new RuntimeException("Could not validate Token", e);
        }
    }

}
