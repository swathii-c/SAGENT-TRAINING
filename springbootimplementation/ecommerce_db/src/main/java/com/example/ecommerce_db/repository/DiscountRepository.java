package com.example.ecommerce_db.repository;

import com.example.ecommerce_db.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, Integer> {}
