package com.anirudh.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anirudh.dto.InvitationDto;

@RestController
@RequestMapping("/api/invite")
public class InvitationController {
    
    @PostMapping("/send")
    public String sendInviteEmail(@RequestBody List<InvitationDto> emailAddresses)
    {
        try{
            for(InvitationDto email: emailAddresses)
            {
                System.out.println("Invite sent to: "+email.getEmail());
            }
        }catch(Exception e)
        {
            e.printStackTrace();
        }
       return "Invites Sent Successfully";
    }
}
