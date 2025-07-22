package com.anirudh.utils;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.cache.CacheProperties.Redis;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.anirudh.model.GeoData;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

@Component
public class IpUtil {

    @Autowired
    @Qualifier("redisObjectTemplate")
    private RedisTemplate<String, Object> redisObjectTemplate;

    private static final List<String> MOCK_IPS = List.of(
        "8.8.8.8",      // USA (Google)
        "1.1.1.1",      // Australia (Cloudflare)
        "185.60.216.35",// Ireland (Facebook)
        "203.0.113.1",  // Reserved for documentation (simulated Asia)
        "5.255.255.5"   // Russia (Yandex)
    );
     private static final Random random = new Random();

  public String getClientIp(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
    
       String ip= (header == null || header.isEmpty()) ? request.getRemoteAddr() : header.split(",")[0];
            // ⚠️ For local testing only – replace with dummy IP (e.g., Google's public IP)
    if ("0:0:0:0:0:0:0:1".equals(ip) || "127.0.0.1".equals(ip)) {
        return MOCK_IPS.get(random.nextInt(MOCK_IPS.size()));
    }
        return ip;
    }

    public GeoData fetchGeoData(String ip) {
        try {
            if(redisObjectTemplate.hasKey(ip)) {
                System.out.println("Fetching GeoData from Redis for IP: " + ip);
                System.out.println("GeoData: " + redisObjectTemplate.opsForValue().get(ip));
                return (GeoData) redisObjectTemplate.opsForValue().get(ip);
            }
            else{
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://ipapi.co/" + ip + "/json/";
            String response= restTemplate.getForObject(url, String.class);
            System.out.println("Response from IP API: " + response);
            GeoData userGeoData= restTemplate.getForObject(url, GeoData.class);
            redisObjectTemplate.opsForValue().set(ip,userGeoData,5,TimeUnit.MINUTES);
            return userGeoData;
            }
        } catch (Exception e) {
            System.out.println("Error fetching GeoData for IP: " + ip + " - " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }   
}
