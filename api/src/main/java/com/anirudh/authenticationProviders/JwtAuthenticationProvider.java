package com.anirudh.authenticationProviders;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;

import com.anirudh.service.*;
import com.anirudh.token.JwtAuthenticationToken;
import com.anirudh.utils.JwtUtil;
public class JwtAuthenticationProvider implements AuthenticationProvider {
    private final JwtUtil jwtUtil;
    private final UserService userService;

     public JwtAuthenticationProvider(JwtUtil jwtUtil, UserService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userService = userDetailsService;
     }
        @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String token = ((JwtAuthenticationToken) authentication).getToken();
        boolean isAdminToken = ((JwtAuthenticationToken) authentication).isAdminToken();

        if(isAdminToken){
            String email = jwtUtil.validateAndExtractEmailForDashboard(token);
            System.out.println("Email extracted from Admin JWT: " + email);
            if (email == null) {
                throw new BadCredentialsException("Invalid Admin JWT Token");
            }

            UserDetails userDetails = userService.findByEmail(email);
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        }
        else{

            String username = jwtUtil.validateAndExtractUsername(token);
            System.out.println("Username extracted from JWT: " + username);
            if (username == null) {
                throw new BadCredentialsException("Invalid JWT Token");
            }

            UserDetails userDetails = userService.loadUserByUsername(username);
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return JwtAuthenticationToken.class.isAssignableFrom(authentication);
    }


}
