package com.anirudh.utils;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
    public ResponseCookie createSessionCookie(String sessionId){
        return ResponseCookie.from("sessionId",sessionId)
                .httpOnly(true) // prevent javascript access
                .secure(true)  // only sent over Https
                .path("/")
                .maxAge(3600)
                .build();
    }

    public ResponseCookie deleteSessionCookie(String sessionId){
        return ResponseCookie.from("sessionId",sessionId)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
    }
}
