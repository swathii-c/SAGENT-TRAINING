package com.example.seat_booking_system.Repository;

import com.example.seat_booking_system.entity.Seats;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatsRepository extends JpaRepository<Seats, Long> {

    List<Seats> findByVenueId(Long venueId);

    // ← ADD THIS
    List<Seats> findBySeatNumber(String seatNumber);
}