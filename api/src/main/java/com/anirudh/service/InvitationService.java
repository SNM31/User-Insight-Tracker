package com.anirudh.service;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.anirudh.dto.InvitationDto;
import com.anirudh.utils.JwtUtil;
import com.anirudh.utils.TokenGenerator;
import com.resend.core.exception.ResendException;

import ch.qos.logback.core.subst.Token;

import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class InvitationService {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    @Qualifier("redisStringTemplate")
    private RedisTemplate<String,String> invitationTokenMapping;
    @Autowired
    private EmailService emailService;
    public void sendInvite(InvitationDto inviteDetails)
    {
            String invitationToken=TokenGenerator.generateUniqueToken();
            invitationTokenMapping.opsForValue().set(invitationToken,inviteDetails.getEmail());
            String inviteLink="http://localhost:3000/register?token="+invitationToken;
            System.out.println("Invite sent to: "+inviteDetails.getEmail()+" with link: "+inviteLink);
            try{
                emailService.sendInvitationEmail(inviteDetails.getEmail(),inviteLink);
            }
            catch(Exception e)
            {
                e.printStackTrace();
            }
    }
    public void verifyInviteToken(String token)
    {
      if (token == null || token.trim().isEmpty()) {
        throw new IllegalArgumentException("Invitation token cannot be null or empty.");
       }
       if(!invitationTokenMapping.hasKey(token))
       {
        throw new RuntimeException("Token not found or already used.");
       }
        String email = invitationTokenMapping.opsForValue().get(token);

        if (email == null) {
            // This case handles if your jwtUtil returns null for other validation failures
            // (like a missing "scope" claim).
            throw new RuntimeException("Token is not a valid invitation token.");
        }
    }
}
