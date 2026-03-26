package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.Venue;
import com.example.seat_booking_system.Repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    public Venue addVenue(Venue venue){
        return venueRepository.save(venue);
    }

    public List<Venue> getAllVenues(){
        return venueRepository.findAll();
    }

    public Venue getVenueById(Long id){
        return venueRepository.findById(id).orElse(null);
    }

    public void deleteVenue(Long id) {
        venueRepository.deleteById(id);
    }

}