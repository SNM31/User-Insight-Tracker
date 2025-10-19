package com.anirudh.token;
import org.springframework.security.authentication.AbstractAuthenticationToken;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {
     private final String token;
     private boolean isAdminToken;

    public JwtAuthenticationToken(String token) {
        super(null);
        this.token = token;
        setAuthenticated(false);
    }

    public String getToken() {
        return token;
    }
    public boolean isAdminToken() {
        return isAdminToken;
    }
    public void setAdminToken(boolean isAdminToken) {
        this.isAdminToken = isAdminToken;
    }
    public JwtAuthenticationToken(String token, boolean isAdminToken) {
        super(null);
        this.token = token;
        this.isAdminToken = isAdminToken;
        setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public Object getPrincipal() {
        return null;
    }

    
}
