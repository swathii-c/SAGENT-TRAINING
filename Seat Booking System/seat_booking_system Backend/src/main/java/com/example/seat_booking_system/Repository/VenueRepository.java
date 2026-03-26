package com.example.seat_booking_system.Repository;

import com.example.seat_booking_system.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {
}