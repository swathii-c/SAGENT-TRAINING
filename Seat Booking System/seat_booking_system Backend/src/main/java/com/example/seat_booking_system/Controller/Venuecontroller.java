package com.example.seat_booking_system.Controller;

import com.example.seat_booking_system.entity.Venue;
import com.example.seat_booking_system.service.VenueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
@RestController
@RequestMapping("/venues")
public class Venuecontroller {

    @Autowired
    private VenueService venueService;

    @PostMapping
    public Venue addVenue(@RequestBody Venue venue){
        return venueService.addVenue(venue);
    }

    @GetMapping
    public List<Venue> getAllVenues(){
        return venueService.getAllVenues();
    }

    @GetMapping("/{id}")
    public Venue getVenueById(@PathVariable Long id){
        return venueService.getVenueById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @RequestBody Venue venue) {
        venue.setVenueId(id);
        return ResponseEntity.ok(venueService.addVenue(venue));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.ok().build();
    }
}