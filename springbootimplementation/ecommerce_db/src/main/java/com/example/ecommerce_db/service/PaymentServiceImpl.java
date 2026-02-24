package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Payment;
import com.example.ecommerce_db.repository.PaymentRepository;
import com.example.ecommerce_db.service.PaymentService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repo;

    public PaymentServiceImpl(PaymentRepository repo) {
        this.repo = repo;
    }

    public Payment save(Payment payment) {
        return repo.save(payment);
    }

    public List<Payment> getAll() {
        return repo.findAll();
    }

    public Payment getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
