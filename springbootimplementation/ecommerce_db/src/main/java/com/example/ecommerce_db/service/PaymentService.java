package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Payment;
import java.util.List;

public interface PaymentService {
    Payment save(Payment payment);
    List<Payment> getAll();
    Payment getById(Integer id);
    void delete(Integer id);
}
