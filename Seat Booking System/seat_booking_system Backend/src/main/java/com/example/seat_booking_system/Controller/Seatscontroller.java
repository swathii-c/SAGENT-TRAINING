package com.example.seat_booking_system.Controller;

import com.example.seat_booking_system.entity.Seats;
import com.example.seat_booking_system.service.SeatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/seats")
public class Seatscontroller {

    @Autowired
    private SeatsService seatsService;

    @PostMapping
    public ResponseEntity<Seats> addSeat(@RequestBody Seats seat) {
        return ResponseEntity.ok(seatsService.addSeat(seat));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<Seats>> getSeatsByVenue(@PathVariable Long venueId) {
        return ResponseEntity.ok(seatsService.getSeatsByVenue(venueId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seats> getSeatById(@PathVariable Long id) {
        Seats seat = seatsService.getSeatById(id);
        if (seat == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(seat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seats> updateSeat(@PathVariable Long id, @RequestBody Seats seat) {
        Seats existing = seatsService.getSeatById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        seat.setSeatId(id);
        return ResponseEntity.ok(seatsService.addSeat(seat));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatsService.deleteSeat(id);
        return ResponseEntity.ok().build();
    }

    // ── Lock Endpoints ──────────────────────────────────────────

    // POST /seats/{id}/lock
    // Body: { "userId": 1, "scheduleId": 2 }
    @PostMapping("/{id}/lock")
    public ResponseEntity<Seats> lockSeat(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long scheduleId = body.get("scheduleId");
        Seats seat = seatsService.lockSeat(id, userId, scheduleId);
        if (seat == null) {
            return ResponseEntity.status(409).build(); // 409 Conflict = already locked
        }
        return ResponseEntity.ok(seat);
    }

    // DELETE /seats/{id}/lock
    // Body: { "userId": 1 }
    @DeleteMapping("/{id}/lock")
    public ResponseEntity<Seats> unlockSeat(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Seats seat = seatsService.unlockSeat(id, userId);
        return ResponseEntity.ok(seat);
    }
}