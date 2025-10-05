package com.anirudh.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class EmailService {
    @Value("${resend.api.key}")
    private String resendApiKey;
    public void sendEmail(String to,String template)
    {
        Resend resend=new Resend(resendApiKey);
        System.out.println("Email sent to: "+to+" with template: "+template);
        CreateEmailOptions emailOptions=CreateEmailOptions.builder()
        .from("19uec151@lnmmit.ac.in")
        .to(to)
        .subject("You're Invited to Join User Insight Tracker!")
        .html(template)
        .build();
        try {
            CreateEmailResponse data = resend.emails().send(emailOptions);
            System.out.println(data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
        }
    }
}
