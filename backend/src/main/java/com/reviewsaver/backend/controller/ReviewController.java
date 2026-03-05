package com.reviewsaver.backend.controller;

import com.reviewsaver.backend.model.Review;
import com.reviewsaver.backend.model.User;
import com.reviewsaver.backend.repository.ReviewRepository;
import com.reviewsaver.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    // POST a new review
    @PostMapping
    public Review createReview(@RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        User user = userRepository.findById(userId).orElseThrow();

        Review review = new Review(
            user,
            request.get("productName").toString(),
            request.get("category").toString(),
            Integer.parseInt(request.get("rating").toString()),
            request.get("reviewText").toString()
        );

        return reviewRepository.save(review);
    }

    // GET all reviews
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // GET reviews by category
    @GetMapping("/category/{category}")
    public List<Review> getReviewsByCategory(@PathVariable String category) {
        return reviewRepository.findByCategory(category);
    }

    // GET reviews by user
    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return reviewRepository.findByUserId(userId);
    }

// Upvote a review
    @PutMapping("/{id}/upvote")
    @SuppressWarnings("null")
    public Review upvoteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow();
        review.setUpvotes(review.getUpvotes() + 1);
        return reviewRepository.save(review);
    }

// Downvote a review
    @PutMapping("/{id}/downvote")
    @SuppressWarnings("null")
    public Review downvoteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow();
        review.setDownvotes(review.getDownvotes() + 1);
        return reviewRepository.save(review);
    }
    // ================== PAGINATION METHODS ==================

    // GET all reviews with pagination
    @GetMapping("/paged")
    public Page<Review> getAllReviewsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return reviewRepository.findAll(pageable);
    }

    // GET reviews by category with pagination
    @GetMapping("/category/{category}/paged")
    public Page<Review> getReviewsByCategoryPaged(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.findByCategory(category, pageable);
    }

    // GET reviews by user with pagination
    @GetMapping("/user/{userId}/paged")
    public Page<Review> getReviewsByUserPaged(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.findByUserId(userId, pageable);
    }
}