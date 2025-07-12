package com.anirudh.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.anirudh.model.GeoData;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class IpUtil {
  public String getClientIp(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
        return (header == null || header.isEmpty()) ? request.getRemoteAddr() : header.split(",")[0];
    }

    public GeoData fetchGeoData(String ip) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://ipapi.co/" + ip + "/json/";
            return restTemplate.getForObject(url, GeoData.class);
        } catch (Exception e) {
            return null;
        }
    }   
}
