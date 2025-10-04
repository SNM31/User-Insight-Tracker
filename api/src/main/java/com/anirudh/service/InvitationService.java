package com.anirudh.service;

import org.springframework.beans.factory.annotation.Autowired;
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
    public void sendInvite(InvitationDto inviteDetails)
    {
        
            String inviteLink="http://localhost:3000/register?token="+jwtUtil.generateInvitationToken(inviteDetails.getEmail(),"DASHBOARD_USER");
            System.out.println("Invite sent to: "+inviteDetails.getEmail()+" with link: "+inviteLink);
    }
}
