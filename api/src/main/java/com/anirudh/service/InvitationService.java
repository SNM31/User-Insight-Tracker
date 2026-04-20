package com.anirudh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.anirudh.dto.GoogleAuthRequest;
import com.anirudh.dto.InvitationDto;
// import com.anirudh.utils.JwtUtil;
import com.anirudh.utils.TokenGenerator;

import java.util.concurrent.TimeUnit;

@Service
public class InvitationService {
    // @Autowired
    // private JwtUtil jwtUtil;
    @Autowired
    @Qualifier("redisObjectTemplate")
    private RedisTemplate<String,InvitationDto> invitationTokenMapping;
    @Autowired
    private EmailService emailService;
    public void sendInvite(InvitationDto inviteDetails)
    {
            if(inviteDetails.getEmail() == null || inviteDetails.getRole() == null) {
                throw new IllegalArgumentException("Email and role cannot be null.");
            }
            String invitationToken=TokenGenerator.generateUniqueToken();
            // need to add role also here with email and for now putting ttl as 2 minutes to test
            invitationTokenMapping.opsForValue().set(invitationToken,inviteDetails,2,TimeUnit.MINUTES);
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
    public String verifyInviteToken(String token)
    {
      if (token == null || token.trim().isEmpty()) {
        throw new IllegalArgumentException("Invitation token cannot be null or empty.");
       }
       
        InvitationDto inviteDetails = invitationTokenMapping.opsForValue().get(token);
        if(inviteDetails == null) {
            throw new RuntimeException("Token not found or already used.");
        }
        if (inviteDetails.getEmail() == null || inviteDetails.getRole() == null) {
            // This case handles if your jwtUtil returns null for other validation failures
            // (like a missing "scope" claim).
            throw new RuntimeException("Token is not a valid invitation token.");
        }
        
        return inviteDetails.getEmail();
    }
    public InvitationDto consumeInviteToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Invitation token cannot be null or empty.");
        }
        InvitationDto invite = invitationTokenMapping.opsForValue().getAndDelete(token);
        if (invite == null) {
            throw new RuntimeException("Token not found or already used.");
        }
        if (invite.getEmail() == null || invite.getRole() == null) {
            throw new RuntimeException("Token is not a valid invitation token.");
        }
        return invite;
    }
    
}
