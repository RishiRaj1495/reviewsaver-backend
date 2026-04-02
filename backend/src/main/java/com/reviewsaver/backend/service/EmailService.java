package com.reviewsaver.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("ReviewSaver - Email Verification");
        message.setText("Your OTP for email verification is: " + otp + "\n\nThis OTP expires in 10 minutes.");
        mailSender.send(message);
    }
    
    public void sendPasswordResetEmail(String to, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("ReviewSaver - Password Reset");
        message.setText("Click the link to reset your password: http://localhost:3000/reset-password?token=" + resetToken);
        mailSender.send(message);
    }
}
