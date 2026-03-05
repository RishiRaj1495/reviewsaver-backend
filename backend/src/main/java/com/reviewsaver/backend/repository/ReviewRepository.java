package com.reviewsaver.backend.repository;

import com.reviewsaver.backend.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCategory(String category);
    List<Review> findByUserId(Long userId);
    List<Review> findByProductName(String productName);
    
    // PAGINATED METHODS
    Page<Review> findAll(Pageable pageable);
    Page<Review> findByCategory(String category, Pageable pageable);
    Page<Review> findByUserId(Long userId, Pageable pageable);
}