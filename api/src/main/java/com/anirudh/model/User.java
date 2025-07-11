package com.anirudh.model;
import java.util.Collection;
import java.util.HashSet;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import java.util.*;


@Entity
@Table(name = "users")
public class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password; // Hashed password
    private String role; // e.g., "ROLE_USER", "ROLE_ADMIN"
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
          Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(role));
        authorities.add(new SimpleGrantedAuthority(this.username));
      
        return authorities;
    }
     public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return this.username;
    }

    public String getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}
