package com.reviewsaver.backend.controller;

import com.reviewsaver.backend.model.User;
import com.reviewsaver.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String deviceHash = request.get("deviceHash");
        
        Map<String, Object> response = new HashMap<>();
        
        // Check if device already registered
        User existingUser = userRepository.findByDeviceHash(deviceHash).orElse(null);
        
        if (existingUser != null) {
            response.put("userId", existingUser.getId());
            response.put("message", "Login successful (existing device)");
            return response;
        }
        
        // Check if email already used with different device
        User userWithEmail = userRepository.findByEmail(email).orElse(null);
        if (userWithEmail != null) {
            response.put("error", "Email already registered with different device");
            return response;
        }
        
        // Create new user
        User newUser = new User(email, deviceHash);
        User savedUser = userRepository.save(newUser);
        
        response.put("userId", savedUser.getId());
        response.put("message", "Login successful (new device)");
        return response;
    }
}