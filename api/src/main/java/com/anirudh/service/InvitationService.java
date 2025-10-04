package com.anirudh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.anirudh.dto.InvitationDto;
import com.anirudh.utils.JwtUtil;

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
    public void sendInvite(InvitationDto inviteDetails)
    {
            String invitationToken=jwtUtil.generateInvitationToken(inviteDetails.getEmail(),"DASHBOARD_USER");
            invitationTokenMapping.opsForValue().set(invitationToken,inviteDetails.getEmail());
            String inviteLink="http://localhost:3000/register?token="+invitationToken;
            System.out.println("Invite sent to: "+inviteDetails.getEmail()+" with link: "+inviteLink);
    }
    public void verifyInviteToken(String token)
    {
       try{
         if(token==null || !invitationTokenMapping.hasKey(token))
         {
            throw new RuntimeException("Token is missing");
         }
         String email= jwtUtil.validateAndExtractEmail(token);
       }catch(Exception e)
       {
        throw new RuntimeException("Invalid Token or Expired",e);
       }
    }
}
