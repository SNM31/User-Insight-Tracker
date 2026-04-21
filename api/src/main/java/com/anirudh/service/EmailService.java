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

        
        String htmlContent = templateEngine.process("emails/invitation-template", context);

       
        sendEmail(to, htmlContent);
    }

    private void sendEmail(String to,String htmlBody)
    {
        Resend resend=new Resend(resendApiKey);
        System.out.println("Email sent to: "+to+" with template: "+htmlBody);
        String fromAddress = "19uec151@lnmmiit.ac.in";
        // #region agent log
        {
            java.util.Map<String, Object> entryData = new java.util.LinkedHashMap<>();
            entryData.put("to", to);
            entryData.put("from", fromAddress);
            entryData.put("apiKeyPresent", resendApiKey != null && !resendApiKey.isBlank());
            entryData.put("apiKeyLength", resendApiKey == null ? 0 : resendApiKey.length());
            entryData.put("apiKeyPrefix", resendApiKey == null ? "" : resendApiKey.substring(0, Math.min(4, resendApiKey.length())));
            com.anirudh.utils.DebugLog.log("E1+E2+E5", "EmailService.java:sendEmail-entry", "resend-send-attempt", entryData);
        }
        // #endregion
        CreateEmailOptions emailOptions=CreateEmailOptions.builder()
        .from(fromAddress)
        .to(to)
        .subject("You're Invited to Join User Insight Tracker!")
        .html(htmlBody)
        .build();
        try {
            CreateEmailResponse data = resend.emails().send(emailOptions);
            System.out.println(data.getId());
            // #region agent log
            com.anirudh.utils.DebugLog.log("E3", "EmailService.java:sendEmail-success", "resend-returned-id",
                    java.util.Map.of("to", to, "emailId", String.valueOf(data.getId())));
            // #endregion
        } catch (ResendException e) {
            // #region agent log
            com.anirudh.utils.DebugLog.log("E1+E2", "EmailService.java:sendEmail-resend-exception", "ResendException-caught",
                    java.util.Map.of(
                            "to", to,
                            "exceptionClass", e.getClass().getName(),
                            "exceptionMessage", String.valueOf(e.getMessage())));
            // #endregion
            e.printStackTrace();
        } catch (Exception e) {
            // #region agent log
            com.anirudh.utils.DebugLog.log("E4", "EmailService.java:sendEmail-other-exception", "UnexpectedException-caught",
                    java.util.Map.of(
                            "to", to,
                            "exceptionClass", e.getClass().getName(),
                            "exceptionMessage", String.valueOf(e.getMessage())));
            // #endregion
            e.printStackTrace();
        }
    }
}
