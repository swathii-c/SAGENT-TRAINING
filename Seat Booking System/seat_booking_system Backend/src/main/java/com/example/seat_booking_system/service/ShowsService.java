package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.Shows;
import com.example.seat_booking_system.Repository.ShowsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowsService {

    @Autowired
    private ShowsRepository showRepository;

    public Shows addShow(Shows show){
        return showRepository.save(show);
    }

    public List<Shows> getAllShows(){
        return showRepository.findAll();
    }

    public Shows getShowById(Long id){
        return showRepository.findById(id).orElse(null);
    }

    public void deleteShow(Long id) {
        showRepository.deleteById(id);
    }

}