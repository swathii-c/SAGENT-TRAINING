package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.Seats;
import com.example.seat_booking_system.Repository.SeatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SeatsService {

    @Autowired
    private SeatsRepository seatRepository;

    // ── Basic CRUD ────────────────────────────────────────────────────────────
    public Seats addSeat(Seats seat) {
        if (seat.getStatus() == null) {
            seat.setStatus("AVAILABLE");
        }
        return seatRepository.save(seat);
    }

    public List<Seats> getSeatsByVenue(Long venueId) {
        // Auto-expire locks before returning seats
        expireLocksForVenue(venueId);
        return seatRepository.findByVenueId(venueId);
    }

    public Seats getSeatById(Long id) {
        return seatRepository.findById(id).orElse(null);
    }

    public void deleteSeat(Long id) {
        seatRepository.deleteById(id);
    }

    // ── Lock a seat for 3 minutes ─────────────────────────────────────────────
    public Seats lockSeat(Long seatId, Long userId, Long scheduleId) {
        Seats seat = seatRepository.findById(seatId).orElse(null);
        if (seat == null) throw new RuntimeException("Seat not found");

        // Auto-expire if lock has passed
        if ("LOCKED".equals(seat.getStatus()) &&
                seat.getLockedUntil() != null &&
                seat.getLockedUntil().isBefore(LocalDateTime.now())) {
            // Lock expired — clear it
            seat.setStatus("AVAILABLE");
            seat.setLockedByUserId(null);
            seat.setLockedForScheduleId(null);
            seat.setLockedAt(null);
            seat.setLockedUntil(null);
        }

        // Check if locked by someone else and still valid
        if ("LOCKED".equals(seat.getStatus()) &&
                !userId.equals(seat.getLockedByUserId()) &&
                seat.getLockedUntil() != null &&
                seat.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Seat is locked by another user");
        }

        // Lock it for 3 minutes
        seat.setStatus("LOCKED");
        seat.setLockedByUserId(userId);
        seat.setLockedForScheduleId(scheduleId);
        seat.setLockedAt(LocalDateTime.now());
        seat.setLockedUntil(LocalDateTime.now().plusMinutes(3));

        return seatRepository.save(seat);
    }

    // ── Unlock a seat ─────────────────────────────────────────────────────────
    public Seats unlockSeat(Long seatId, Long userId) {
        Seats seat = seatRepository.findById(seatId).orElse(null);
        if (seat == null) return null;

        // Only the user who locked it can unlock it
        if ("LOCKED".equals(seat.getStatus()) &&
                userId.equals(seat.getLockedByUserId())) {
            seat.setStatus("AVAILABLE");
            seat.setLockedByUserId(null);
            seat.setLockedForScheduleId(null);
            seat.setLockedAt(null);
            seat.setLockedUntil(null);
            return seatRepository.save(seat);
        }
        return seat;
    }

    // ── Book a seat after payment ─────────────────────────────────────────────
    public Seats bookSeat(Long seatId) {
        Seats seat = seatRepository.findById(seatId).orElse(null);
        if (seat != null) {
            seat.setStatus("AVAILABLE");
            seat.setLockedByUserId(null);
            seat.setLockedForScheduleId(null);
            seat.setLockedAt(null);
            seat.setLockedUntil(null);
            return seatRepository.save(seat);
        }
        return null;
    }

    // ── Release all locks by a user ───────────────────────────────────────────
    public void releaseAllLocks(Long userId, Long venueId) {
        List<Seats> seats = seatRepository.findByVenueId(venueId);
        for (Seats seat : seats) {
            if ("LOCKED".equals(seat.getStatus()) &&
                    userId.equals(seat.getLockedByUserId())) {
                seat.setStatus("AVAILABLE");
                seat.setLockedByUserId(null);
                seat.setLockedForScheduleId(null);
                seat.setLockedAt(null);
                seat.setLockedUntil(null);
                seatRepository.save(seat);
            }
        }
    }

    // ── Auto-expire locks older than 3 minutes ────────────────────────────────
    public void expireLocksForVenue(Long venueId) {
        List<Seats> seats = seatRepository.findByVenueId(venueId);
        for (Seats seat : seats) {
            if ("LOCKED".equals(seat.getStatus()) &&
                    seat.getLockedUntil() != null &&
                    seat.getLockedUntil().isBefore(LocalDateTime.now())) {
                seat.setStatus("AVAILABLE");
                seat.setLockedByUserId(null);
                seat.setLockedForScheduleId(null);
                seat.setLockedAt(null);
                seat.setLockedUntil(null);
                seatRepository.save(seat);
            }
        }
    }
}