package com.anirudh.controller;


import com.anirudh.dto.AuthResponse;
import com.anirudh.dto.UserActivityDto;
import com.anirudh.service.UserActivityServiceImpl;
import com.mysql.cj.x.protobuf.Mysqlx;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/send")
public class ActivityController {
    @Autowired
    private UserActivityServiceImpl userActivityService;

    @PostMapping("/user-activity")
    public ResponseEntity<String> sendUserActivity(@RequestBody UserActivityDto userActivityDto)
    {
       try {
           userActivityService.processUserActivity(userActivityDto);
           return new ResponseEntity<>("User Activity Recorded", HttpStatus.OK);
       }catch (Exception e){
           return new ResponseEntity<>(e.toString(),HttpStatus.INTERNAL_SERVER_ERROR);
           // check this
       }
    }

}
