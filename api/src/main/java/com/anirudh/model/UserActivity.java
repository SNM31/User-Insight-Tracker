package com.anirudh.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
@Builder
@Data
@Entity
@Table(name = "user_activity")
public class UserActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userId;
    @Enumerated(EnumType.STRING)
    private EventType eventType;
    private String category;
    private String subcategory;
    public Integer duration;
    private LocalDateTime timestamp;
    @Column(name = "ip_address")
    private String ipAddress;

    private String country;
    private String city;

    @Column(name = "device_type")
    private String deviceType;
}