package com.example.ecommerce_db.repository;

import com.example.ecommerce_db.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {}
