package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Delivery;
import java.util.List;

public interface DeliveryService {
    Delivery save(Delivery delivery);
    List<Delivery> getAll();
    Delivery getById(Integer id);
    void delete(Integer id);
}

