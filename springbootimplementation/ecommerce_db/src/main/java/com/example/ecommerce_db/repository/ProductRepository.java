package com.example.ecommerce_db.repository;

import com.example.ecommerce_db.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {}
