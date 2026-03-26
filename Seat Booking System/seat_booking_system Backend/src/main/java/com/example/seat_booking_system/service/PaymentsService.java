package com.example.seat_booking_system.service;



import com.example.seat_booking_system.entity.Payments;
import com.example.seat_booking_system.Repository.PaymentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class PaymentsService {

    @Autowired
    private PaymentsRepository paymentRepository;

    public Payments processPayment(Payments payment){

        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus("SUCCESS");

        return paymentRepository.save(payment);
    }

    public List<Payments> getPaymentsByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}