package com.reviewsaver.backend.controller;

import com.reviewsaver.backend.model.User;
import com.reviewsaver.backend.repository.UserRepository;
import com.reviewsaver.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // Get user profile by ID
    @GetMapping("/{userId}")
    public User getUserProfile(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get user stats (total reviews, upvotes received, downvotes received)
    @GetMapping("/{userId}/stats")
    public Map<String, Object> getUserStats(@PathVariable Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get all reviews by this user
        var userReviews = reviewRepository.findByUserId(userId);
        
        int totalReviews = userReviews.size();
        int totalUpvotes = userReviews.stream().mapToInt(r -> r.getUpvotes()).sum();
        int totalDownvotes = userReviews.stream().mapToInt(r -> r.getDownvotes()).sum();
        
        stats.put("userId", userId);
        stats.put("email", user.getEmail());
        stats.put("memberSince", user.getCreatedAt());
        stats.put("totalReviews", totalReviews);
        stats.put("totalUpvotes", totalUpvotes);
        stats.put("totalDownvotes", totalDownvotes);
        
        return stats;
    }
}