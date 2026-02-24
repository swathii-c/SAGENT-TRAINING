package com.example.admission_db.service;

import com.example.admission_db.entity.DesiredCourse;
import com.example.admission_db.repository.DesiredCourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DesiredCourseServiceImpl implements DesiredCourseService {

    @Autowired
    private DesiredCourseRepository repo;

    @Override
    public DesiredCourse save(DesiredCourse course) {
        return repo.save(course);
    }

    @Override
    public List<DesiredCourse> getAll() {
        return repo.findAll();
    }

    @Override
    public DesiredCourse getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
