package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.ShowSchedule;
import com.example.seat_booking_system.Repository.ShowScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowScheduleService {

    @Autowired
    private ShowScheduleRepository scheduleRepository;

    public ShowSchedule addSchedule(ShowSchedule schedule){
        return scheduleRepository.save(schedule);
    }

    public List<ShowSchedule> getAllSchedules(){
        return scheduleRepository.findAll();
    }

    public ShowSchedule getScheduleById(Long id) {
        return scheduleRepository.findById(id).orElse(null);
    }

    // ✅ ADD THIS
    public List<ShowSchedule> getSchedulesByShow(Long showId) {
        return scheduleRepository.findByShowId(showId);
    }

    // ✅ ADD THIS
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

}