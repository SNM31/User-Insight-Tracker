package com.anirudh.service;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.anirudh.utils.JwtUtil;
@Service
public class TokenBlacklistService {
  private final RedisTemplate<String,String> redisTemplate;
  private final JwtUtil jwtUtil;
  
   public TokenBlacklistService(RedisTemplate<String,String> redisTemplate,JwtUtil jwtUtil) {
         this.redisTemplate = redisTemplate;    
         this.jwtUtil = jwtUtil;
   }
   public void blackListToken(String token){
        // Store the token in Redis with a short expiration time
        long ttl=jwtUtil.getExpirationFromToken(token)-System.currentTimeMillis();
        if(ttl>0){
        redisTemplate.opsForValue().set(token, "blacklisted",ttl/1000, TimeUnit.SECONDS);
            printToken(token);
        } 
   }    
   public void printToken(String token) {
        String value = redisTemplate.opsForValue().get(token);
        System.out.println(" ");
        System.out.println("Token is Blacked and added in Redis as : " + token + " | Value: " + value);
    }
    public boolean isTokenBlacklisted(String token) {
        System.out.println("Checking if token is blacklisted: " + token);
        return redisTemplate.hasKey(token);
    } 
}
