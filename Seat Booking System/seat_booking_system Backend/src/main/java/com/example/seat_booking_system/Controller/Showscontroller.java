package com.example.seat_booking_system.Controller;

import com.example.seat_booking_system.entity.Shows;
import com.example.seat_booking_system.service.ShowsService;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shows")
public class Showscontroller {

    @Autowired
    private ShowsService showService;

    @PostMapping
    public Shows addShow(@RequestBody Shows show){
        return showService.addShow(show);
    }

    @GetMapping
    public List<Shows> getAllShows(){
        return showService.getAllShows();
    }

    @GetMapping("/{id}")
    public Shows getShowById(@PathVariable Long id){
        return showService.getShowById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shows> updateShow(@PathVariable Long id, @RequestBody Shows show) {
        show.setShowId(id);
        return ResponseEntity.ok(showService.addShow(show));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.ok().build();
    }
}