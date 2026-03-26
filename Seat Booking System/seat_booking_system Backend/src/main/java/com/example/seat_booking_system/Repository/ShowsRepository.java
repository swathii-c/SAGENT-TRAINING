package com.example.seat_booking_system.Repository;

import com.example.seat_booking_system.entity.Shows;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowsRepository extends JpaRepository<Shows, Long> {
}