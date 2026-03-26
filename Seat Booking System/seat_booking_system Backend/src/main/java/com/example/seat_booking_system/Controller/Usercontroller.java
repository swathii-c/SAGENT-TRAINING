package com.example.seat_booking_system.Controller;

import com.example.seat_booking_system.entity.User;
import com.example.seat_booking_system.service.UserService;
import com.example.seat_booking_system.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/users")
public class Usercontroller {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User saved = userService.registerUser(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        User user = userService.loginUser(email, password);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    // ── Forgot Password — email + new password directly ───────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");
        String result = userService.forgotPassword(email, newPassword);
        if (result.equals("NOT_FOUND")) {
            return ResponseEntity.status(404).body("No account found with this email.");
        }
        return ResponseEntity.ok("Password reset successfully!");
    }

    // ── Test Email ────────────────────────────────────────────────────────────
    @GetMapping("/test-email")
    public String testEmail() {
        emailService.sendBookingConfirmation(
                "swathiii261@gmail.com",
                "Swathi", 999L,
                "Test Show", "2026-03-20", "18:00",
                "PVR Cinemas", "A1, A2", 500.0, "UPI"
        );
        return "Email test triggered! Check console and inbox.";
    }
}