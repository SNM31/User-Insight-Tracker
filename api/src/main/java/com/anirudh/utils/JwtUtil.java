package com.anirudh.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final String secretKey = "your-secret-key-here";
    private final int tokenExpiryTime = 10 * 60 * 60 * 10;

    public String generateToken(String userName)
    {
        return JWT.create()
                .withSubject(userName)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + tokenExpiryTime * 1000))
                .sign(Algorithm.HMAC256(secretKey));
    }

   public String extractUserName(String token)
   {
       return JWT.decode(token).getSubject();
   }

   public boolean validateToken(String token,String userName)
   {
       return extractUserName(token).equals(userName) ;
   }

   public boolean isTokenExpired(String token){
        Date expiration =JWT.decode(token).getExpiresAt();
        return expiration.before(new Date());
   }
}
