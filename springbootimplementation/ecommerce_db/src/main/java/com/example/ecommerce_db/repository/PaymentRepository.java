package com.example.ecommerce_db.repository;

import com.example.ecommerce_db.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {}
