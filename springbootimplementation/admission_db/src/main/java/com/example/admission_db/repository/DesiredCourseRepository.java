package com.example.admission_db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.admission_db.entity.DesiredCourse;

public interface DesiredCourseRepository extends JpaRepository<DesiredCourse, Integer> {
}

