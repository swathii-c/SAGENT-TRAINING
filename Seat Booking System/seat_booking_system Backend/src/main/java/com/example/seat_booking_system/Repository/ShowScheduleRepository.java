package com.example.seat_booking_system.Repository;

import com.example.seat_booking_system.entity.ShowSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowScheduleRepository extends JpaRepository<ShowSchedule, Long> {

    List<ShowSchedule> findByShowId(Long showId);

}