package com.example.admission_db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.admission_db.entity.FeesPayment;

public interface FeesPaymentRepository extends JpaRepository<FeesPayment, Integer> {
}
