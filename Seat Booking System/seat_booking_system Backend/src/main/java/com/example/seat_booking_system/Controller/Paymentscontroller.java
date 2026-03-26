package com.example.seat_booking_system.Controller;


import org.springframework.http.ResponseEntity;
import com.example.seat_booking_system.entity.Payments;
import com.example.seat_booking_system.service.PaymentsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/payments")
public class Paymentscontroller {

    @Autowired
    private PaymentsService paymentService;

    @PostMapping
    public Payments processPayment(@RequestBody Payments payment) {
        return paymentService.processPayment(payment);
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payments>> getPaymentsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBooking(bookingId));
    }
}