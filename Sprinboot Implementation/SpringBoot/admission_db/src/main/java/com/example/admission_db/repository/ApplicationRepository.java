package com.example.admission_db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.admission_db.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
}
