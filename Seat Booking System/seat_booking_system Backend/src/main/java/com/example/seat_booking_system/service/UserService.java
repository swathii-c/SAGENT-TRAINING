package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.User;
import com.example.seat_booking_system.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // ── Forgot Password — no email verification needed ────────────────────────
    public String forgotPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) return "NOT_FOUND";
        user.setPassword(newPassword);
        userRepository.save(user);
        return "SUCCESS";
    }
}