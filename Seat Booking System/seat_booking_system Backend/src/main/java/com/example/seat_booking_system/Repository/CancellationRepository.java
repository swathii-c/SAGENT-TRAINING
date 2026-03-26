package com.example.seat_booking_system.Repository;

import com.example.seat_booking_system.entity.Cancellation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CancellationRepository extends JpaRepository<Cancellation, Long> {
}