package com.anirudh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anirudh.dto.GoogleAuthRequest;
import com.anirudh.dto.InvitationDto;
import com.anirudh.service.GoogleAuthService;
import com.anirudh.service.InvitationService;

@RestController
@RequestMapping("/api/invite")
public class InvitationController {
    @Autowired
    private InvitationService invitationService;
    @Autowired
    private GoogleAuthService googleAuthService;
    
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
           String email= invitationService.verifyInviteToken(invitationToken);
            return ResponseEntity.ok(email);
        }
        catch(IllegalArgumentException e){
             e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Empty token or null " );
        }
        catch(RuntimeException e)
        {
             e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Token not Found or Expired " );
        }
        catch(Exception e)
        {
             e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " );
        }
    }
    @PostMapping("/finalize")
    public ResponseEntity<String> finalizeInvitation(@RequestBody GoogleAuthRequest googleAuthRequest)
    {
        try{
            String email=invitationService.verifyInviteToken(googleAuthRequest.getInvitationToken());
            System.out.println("Email from invitation token: "+email);
            googleAuthService.authenticate(googleAuthRequest.getGoogleIdToken(),email);
            return ResponseEntity.ok("Invitation finalized successfully. You can now log in.");
        }
        catch(IllegalArgumentException e){
             e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Empty token or null " );
        }
        catch(RuntimeException e)
        {
             e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Token not Found or Expired " );
        }
        catch(Exception e)
        {
             e.printStackTrace();
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error: " );
        }
    }
}
