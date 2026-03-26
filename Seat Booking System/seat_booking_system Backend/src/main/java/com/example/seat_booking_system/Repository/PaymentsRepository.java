package com.example.seat_booking_system.Repository;
import java.util.List;

import com.example.seat_booking_system.entity.Payments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentsRepository extends JpaRepository<Payments, Long> {
    List<Payments> findByBookingId(Long bookingId);
}