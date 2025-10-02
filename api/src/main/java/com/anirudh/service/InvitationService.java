package com.anirudh.service;

import org.springframework.stereotype.Service;

import com.anirudh.dto.InvitationDto;

import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class InvitationService {
    public void sendInvites(List<InvitationDto> emailAddresses)
    {
        for(InvitationDto email: emailAddresses)
        {
            String inviteLink="http://localhost:3000/register?token="+generateInviteToken(email.getEmail());
            System.out.println("Invite sent to: "+email.getEmail()+" with link: "+inviteLink);
        }
    }
    private String generateInviteToken(String email)
    {
        Base64.Encoder encoder=Base64.getUrlEncoder().withoutPadding();
        String token=encoder.encodeToString((email+":"+UUID.randomUUID().toString()).getBytes());
        return token;
    }
}
