package com.reviewsaver.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(fromEmail);
        message.setSubject("🔐 ReviewSaver - Email Verification");
        message.setText("Hello,\n\n"
                + "Your OTP for email verification is: " + otp + "\n\n"
                + "This OTP expires in 10 minutes.\n\n"
                + "If you didn't request this, please ignore this email.\n\n"
                + "Thanks,\nReviewSaver Team");
        mailSender.send(message);
    }
    
    public void sendPasswordResetEmail(String to, String resetToken) {
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(fromEmail);
        message.setSubject("🔐 ReviewSaver - Password Reset Request");
        message.setText("Hello,\n\n"
                + "We received a request to reset your password.\n\n"
                + "Click the link below to reset your password:\n"
                + resetLink + "\n\n"
                + "This link expires in 1 hour.\n\n"
                + "If you didn't request this, please ignore this email.\n\n"
                + "Thanks,\nReviewSaver Team");
        mailSender.send(message);
    }
    
    public void sendWelcomeEmail(String to, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(fromEmail);
        message.setSubject("🎉 Welcome to ReviewSaver!");
        message.setText("Hello " + username + ",\n\n"
                + "Welcome to ReviewSaver - India's #1 Review Platform!\n\n"
                + "Start exploring reviews, share your experiences, and help others make informed decisions.\n\n"
                + "Get started by writing your first review today!\n\n"
                + "Thanks,\nReviewSaver Team");
        mailSender.send(message);
    }
}