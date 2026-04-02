package com.reviewsaver.backend.controller;

import com.reviewsaver.backend.model.User;
import com.reviewsaver.backend.repository.UserRepository;
import com.reviewsaver.backend.service.EmailService;
import com.reviewsaver.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private EmailService emailService;
    
    private final Random random = new Random();
    
    // ========== DEVICE HASH LOGIN (Backward Compatible) ==========
    @PostMapping("/login-device")
    public Map<String, Object> loginWithDevice(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String deviceHash = request.get("deviceHash");
        
        Map<String, Object> response = new HashMap<>();
        
        // Check if device already registered
        User existingUser = userRepository.findByDeviceHash(deviceHash).orElse(null);
        
        if (existingUser != null) {
            response.put("userId", existingUser.getId());
            response.put("message", "Login successful (existing device)");
            response.put("email", existingUser.getEmail());
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
        response.put("email", savedUser.getEmail());
        return response;
    }
    
    // ========== EMAIL/PASSWORD REGISTRATION ==========
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        // Validate email format
        if (!isValidEmail(email)) {
            response.put("error", "Invalid email format");
            return response;
        }
        
        // Validate password strength
        if (!isValidPassword(password)) {
            response.put("error", "Password must be at least 6 characters");
            return response;
        }
        
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            response.put("error", "Email already registered");
            return response;
        }
        
        // Generate OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        
        // Create new user
        User newUser = new User(email, passwordEncoder.encode(password), false);
        newUser.setVerificationToken(otp);
        newUser.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(10));
        
        userRepository.save(newUser);
        
        // Send OTP email
        try {
            emailService.sendOtpEmail(email, otp);
            response.put("message", "Registration successful. OTP sent to your email.");
        } catch (Exception e) {
            response.put("message", "Registration successful but failed to send OTP. Please use resend-otp.");
        }
        response.put("userId", newUser.getId());
        response.put("email", email);
        
        return response;
    }
    
    // ========== EMAIL VERIFICATION (OTP) ==========
    @PostMapping("/verify-email")
    public Map<String, Object> verifyEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }
        
        User user = userOpt.get();
        
        if (user.isVerified()) {
            response.put("error", "Email already verified");
            return response;
        }
        
        if (user.getVerificationToken() == null || !user.getVerificationToken().equals(otp)) {
            response.put("error", "Invalid OTP");
            return response;
        }
        
        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            response.put("error", "OTP expired. Please request a new one.");
            return response;
        }
        
        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        
        response.put("message", "Email verified successfully");
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        return response;
    }
    
    // ========== RESEND OTP ==========
    @PostMapping("/resend-otp")
    public Map<String, Object> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }
        
        User user = userOpt.get();
        
        if (user.isVerified()) {
            response.put("error", "Email already verified");
            return response;
        }
        
        String otp = String.format("%06d", random.nextInt(1000000));
        user.setVerificationToken(otp);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        
        try {
            emailService.sendOtpEmail(email, otp);
            response.put("message", "OTP sent successfully");
        } catch (Exception e) {
            response.put("error", "Failed to send OTP. Please try again.");
        }
        
        return response;
    }
    
    // ========== EMAIL/PASSWORD LOGIN ==========
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("error", "Invalid email or password");
            return response;
        }
        
        User user = userOpt.get();
        
        // Check if user has password (migrated from device hash)
        if (user.getPassword() == null) {
            response.put("error", "Please login using device hash or set a password first");
            return response;
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("error", "Invalid email or password");
            return response;
        }
        
        if (!user.isVerified()) {
            response.put("error", "Please verify your email first");
            return response;
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        return response;
    }
    
    // ========== FORGOT PASSWORD - Request Reset ==========
    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }
        
        User user = userOpt.get();
        
        // Generate reset token
        String resetToken = jwtUtil.generateToken(user.getEmail(), user.getId());
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        
        try {
            emailService.sendPasswordResetEmail(email, resetToken);
            response.put("message", "Password reset link sent to your email");
        } catch (Exception e) {
            response.put("error", "Failed to send reset email");
        }
        
        return response;
    }
    
    // ========== RESET PASSWORD ==========
    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        
        Map<String, Object> response = new HashMap<>();
        
        // Validate token
        if (!jwtUtil.validateToken(token)) {
            response.put("error", "Invalid or expired token");
            return response;
        }
        
        String email = jwtUtil.extractEmail(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }
        
        User user = userOpt.get();
        
        if (user.getResetToken() == null || !user.getResetToken().equals(token)) {
            response.put("error", "Invalid reset token");
            return response;
        }
        
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            response.put("error", "Reset token expired");
            return response;
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        
        response.put("message", "Password reset successful. Please login with your new password.");
        return response;
    }
    
    // ========== SET PASSWORD (for device hash users migrating) ==========
    @PostMapping("/set-password")
    public Map<String, Object> setPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String deviceHash = request.get("deviceHash");
        String newPassword = request.get("newPassword");
        
        Map<String, Object> response = new HashMap<>();
        
        User user = userRepository.findByDeviceHash(deviceHash).orElse(null);
        
        if (user == null || !user.getEmail().equals(email)) {
            response.put("error", "Invalid credentials");
            return response;
        }
        
        if (!isValidPassword(newPassword)) {
            response.put("error", "Password must be at least 6 characters");
            return response;
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerified(true);
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        
        response.put("message", "Password set successfully");
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        return response;
    }
    
    // ========== VALIDATION METHODS ==========
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return email != null && email.matches(emailRegex);
    }
    
    private boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }
}
