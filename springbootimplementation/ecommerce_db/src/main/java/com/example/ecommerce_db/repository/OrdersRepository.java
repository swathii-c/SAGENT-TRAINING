package com.example.ecommerce_db.repository;

import com.example.ecommerce_db.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {}
