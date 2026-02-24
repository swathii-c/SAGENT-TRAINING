package com.example.admission_db.service;

import com.example.admission_db.entity.DesiredCourse;
import java.util.List;

public interface DesiredCourseService {

    DesiredCourse save(DesiredCourse course);

    List<DesiredCourse> getAll();

    DesiredCourse getById(Integer id);

    void delete(Integer id);
}
