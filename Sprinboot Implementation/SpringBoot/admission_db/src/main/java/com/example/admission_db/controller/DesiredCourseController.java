package com.example.admission_db.controller;

import com.example.admission_db.entity.DesiredCourse;
import com.example.admission_db.service.DesiredCourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class DesiredCourseController {

    @Autowired
    private DesiredCourseService service;

    // ✅ Create Course
    @PostMapping
    public DesiredCourse save(@RequestBody DesiredCourse course) {
        return service.save(course);
    }

    // ✅ Get All Courses
    @GetMapping
    public List<DesiredCourse> getAll() {
        return service.getAll();
    }

    // ✅ Get Course By ID
    @GetMapping("/{id}")
    public DesiredCourse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // ✅ Delete Course
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
