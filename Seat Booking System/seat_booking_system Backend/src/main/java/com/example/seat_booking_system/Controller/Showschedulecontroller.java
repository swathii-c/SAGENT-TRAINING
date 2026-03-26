package com.example.seat_booking_system.Controller;

import com.example.seat_booking_system.entity.ShowSchedule;
import com.example.seat_booking_system.service.ShowScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/schedules")
public class Showschedulecontroller {

    @Autowired
    private ShowScheduleService scheduleService;

    @PostMapping
    public ShowSchedule addSchedule(@RequestBody ShowSchedule schedule){
        return scheduleService.addSchedule(schedule);
    }

    @GetMapping
    public List<ShowSchedule> getAllSchedules(){
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowSchedule> getScheduleById(@PathVariable Long id) {
        ShowSchedule schedule = scheduleService.getScheduleById(id);
        if (schedule == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/show/{showId}")
    public ResponseEntity<List<ShowSchedule>> getSchedulesByShow(@PathVariable Long showId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByShow(showId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowSchedule> updateSchedule(@PathVariable Long id, @RequestBody ShowSchedule schedule) {
        ShowSchedule existing = scheduleService.getScheduleById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        schedule.setScheduleId(id);
        return ResponseEntity.ok(scheduleService.addSchedule(schedule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok().build();
    }
}