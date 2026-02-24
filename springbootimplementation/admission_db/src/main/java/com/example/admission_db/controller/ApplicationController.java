package com.example.admission_db.controller;

import com.example.admission_db.entity.Application;
import com.example.admission_db.service.ApplicationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService service;

    // ✅ Create Application
    @PostMapping
    public Application save(@RequestBody Application application) {
        return service.save(application);
    }

    // ✅ Get All Applications
    @GetMapping
    public List<Application> getAll() {
        return service.getAll();
    }

    // ✅ Get Application By ID
    @GetMapping("/{id}")
    public Application getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // ✅ Delete Application
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
