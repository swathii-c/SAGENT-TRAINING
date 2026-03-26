package com.example.seat_booking_system.Controller;

import com.example.seat_booking_system.entity.Cancellation;
import com.example.seat_booking_system.service.CancellationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cancellations")
public class Cancellationcontroller {

    @Autowired
    private CancellationService cancellationService;

    @PostMapping
    public Cancellation cancelBooking(@RequestBody Cancellation cancellation){
        return cancellationService.cancelBooking(cancellation);
    }
}