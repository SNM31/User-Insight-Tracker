package com.anirudh.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.anirudh.model.GeoData;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class IpUtil {
  public String getClientIp(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
    
       String ip= (header == null || header.isEmpty()) ? request.getRemoteAddr() : header.split(",")[0];
            // ⚠️ For local testing only – replace with dummy IP (e.g., Google's public IP)
    if ("0:0:0:0:0:0:0:1".equals(ip) || "127.0.0.1".equals(ip)) {
        return "8.8.8.8"; // Replace with a public IP address for testing
    }
        return ip;
    }

    public GeoData fetchGeoData(String ip) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://ipapi.co/" + ip + "/json/";
            String response= restTemplate.getForObject(url, String.class);
            System.out.println("Response from IP API: " + response);
            return restTemplate.getForObject(url, GeoData.class);
        } catch (Exception e) {
            return null;
        }
    }   
}
