package com.example.admission_db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.admission_db.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
}
