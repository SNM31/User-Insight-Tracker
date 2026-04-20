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
import com.anirudh.dto.AuthResponse;
import org.springframework.security.access.prepost.PreAuthorize;
@RestController
@RequestMapping("/api/admin/invite")
public class InvitationController {
    @Autowired
    private InvitationService invitationService;
    @Autowired
    private GoogleAuthService googleAuthService;
    
    @PreAuthorize("hasRole('ADMIN')")
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
    public ResponseEntity<?> finalizeInvitation(@RequestBody GoogleAuthRequest googleAuthRequest)
    {
        try{
            // verifying if token is valid or not
           InvitationDto inviteDetails=invitationService.consumeInviteToken(googleAuthRequest.getInvitationToken());
           String jwt=googleAuthService.authenticateForInvitation(
                           googleAuthRequest.getGoogleIdToken(),
                          inviteDetails.getEmail(),
                          inviteDetails.getRole()
                        );
           return ResponseEntity.ok(AuthResponse.builder()
               .token(jwt)
               .message("Invitation finalized successfully.")
               .statusCode(HttpStatus.OK.value())
               .build());
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
