package com.reviewsaver.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String password;  // NEW - Hashed password for email/password login
    
    @Column(unique = true)
    private String deviceHash;  // Keep for backward compatibility
    
    private boolean verified;  // NEW - Email verified flag
    
    private String verificationToken;  // NEW - OTP token for email verification
    
    private LocalDateTime verificationTokenExpiry;  // NEW - OTP expiry time
    
    private String resetToken;  // NEW - Password reset token
    
    private LocalDateTime resetTokenExpiry;  // NEW - Password reset token expiry
    
    private LocalDateTime createdAt;
    
    // Constructors
    public User() {}
    
    // Original constructor (for device hash login - backward compatible)
    public User(String email, String deviceHash) {
        this.email = email;
        this.deviceHash = deviceHash;
        this.verified = true;  // Device hash users are considered verified
        this.createdAt = LocalDateTime.now();
    }
    
    // New constructor (for email/password registration)
    public User(String email, String password, boolean verified) {
        this.email = email;
        this.password = password;
        this.verified = verified;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getDeviceHash() {
        return deviceHash;
    }
    
    public void setDeviceHash(String deviceHash) {
        this.deviceHash = deviceHash;
    }
    
    public boolean isVerified() {
        return verified;
    }
    
    public void setVerified(boolean verified) {
        this.verified = verified;
    }
    
    public String getVerificationToken() {
        return verificationToken;
    }
    
    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }
    
    public LocalDateTime getVerificationTokenExpiry() {
        return verificationTokenExpiry;
    }
    
    public void setVerificationTokenExpiry(LocalDateTime verificationTokenExpiry) {
        this.verificationTokenExpiry = verificationTokenExpiry;
    }
    
    public String getResetToken() {
        return resetToken;
    }
    
    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }
    
    public LocalDateTime getResetTokenExpiry() {
        return resetTokenExpiry;
    }
    
    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
