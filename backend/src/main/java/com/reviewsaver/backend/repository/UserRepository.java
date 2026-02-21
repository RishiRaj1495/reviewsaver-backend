package com.reviewsaver.backend.repository;

import com.reviewsaver.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByDeviceHash(String deviceHash);
    Optional<User> findByEmail(String email);
}
