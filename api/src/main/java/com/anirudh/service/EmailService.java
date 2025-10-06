package com.anirudh.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class EmailService {
    @Value("${resend.api.key}")
    private String resendApiKey;
    @Autowired
    private TemplateEngine templateEngine;
 
     public void sendInvitationEmail(String to, String invitationLink) {
    
        Context context = new Context();
        context.setVariable("invitationLink", invitationLink);

        
        String htmlContent = templateEngine.process("email/invitation-template", context);

       
        sendEmail(to, htmlContent);
    }

    private void sendEmail(String to,String htmlBody)
    {
        Resend resend=new Resend(resendApiKey);
        System.out.println("Email sent to: "+to+" with template: "+htmlBody);
        CreateEmailOptions emailOptions=CreateEmailOptions.builder()
        .from("19uec151@lnmmit.ac.in")
        .to(to)
        .subject("You're Invited to Join User Insight Tracker!")
        .html(htmlBody)
        .build();
        try {
            CreateEmailResponse data = resend.emails().send(emailOptions);
            System.out.println(data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
        }
    }
}
