package com.anirudh.dto;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String invitationToken;
    private String googleIdToken;
}
