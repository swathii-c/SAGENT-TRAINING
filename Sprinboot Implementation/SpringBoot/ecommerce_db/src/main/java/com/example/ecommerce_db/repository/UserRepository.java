package com.example.ecommerce_db.repository;

import com.example.ecommerce_db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {}
