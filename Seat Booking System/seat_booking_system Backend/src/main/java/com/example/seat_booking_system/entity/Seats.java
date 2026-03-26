package com.example.seat_booking_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seats")
public class Seats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seatId;
    private String seatNumber;
    private String seatType;
    private double price;
    private Long venueId;

    // ── NEW LOCK FIELDS ──────────────────────────────────────
    private String status;        // AVAILABLE, LOCKED, BOOKED
    private Long lockedByUserId;  // which user locked it
    private Long lockedForScheduleId; // which schedule it's locked for
    private LocalDateTime lockedAt;
    private LocalDateTime lockedUntil; // lock expires after 5 mins

    public Seats() {}

    // Existing getters/setters
    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Long getVenueId() { return venueId; }
    public void setVenueId(Long venueId) { this.venueId = venueId; }

    // ── NEW getters/setters ──────────────────────────────────
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getLockedByUserId() { return lockedByUserId; }
    public void setLockedByUserId(Long lockedByUserId) { this.lockedByUserId = lockedByUserId; }

    public Long getLockedForScheduleId() { return lockedForScheduleId; }
    public void setLockedForScheduleId(Long lockedForScheduleId) { this.lockedForScheduleId = lockedForScheduleId; }

    public LocalDateTime getLockedAt() { return lockedAt; }
    public void setLockedAt(LocalDateTime lockedAt) { this.lockedAt = lockedAt; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }
}