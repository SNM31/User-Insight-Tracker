// src/main/java/com/example/dto/UserInteractionDto.java

package com.anirudh.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserActivityDto {
private String eventType;
private String sessionId;
private String category;
private String subcategory;
private Integer duration;
private LocalDateTime timestamp;
private String deviceinfo;
}