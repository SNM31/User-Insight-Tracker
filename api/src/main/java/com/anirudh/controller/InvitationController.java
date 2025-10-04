package com.anirudh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anirudh.dto.InvitationDto;
import com.anirudh.service.InvitationService;

@RestController
@RequestMapping("/api/invite")
public class InvitationController {
    @Autowired
    private InvitationService invitationService;
    
    @PostMapping("/send")
    public ResponseEntity<String> sendInviteEmail(@RequestBody List<InvitationDto> emailAddresses)
    {
        try{
            for(InvitationDto email: emailAddresses)
            {
               invitationService.sendInvite(email);

            }
            
        return ResponseEntity.ok("Send Invite Successfully");  
        }catch(Exception e)
        {
            e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " );

        }
    }
    @GetMapping("/join/verify")
    public ResponseEntity<String> verifyInviationToken(@RequestParam String invitationToken)
    {
        try{
            boolean verified=invitationService.verifyInviteToken(invitationToken);
            if(verified)
            {
                return ResponseEntity.ok("Token verofied and is correct");
            }
            else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).
                body("Invalid Token or Expired");
            }
        }
        catch(Exception e){
             e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " );
        }
    }
}
