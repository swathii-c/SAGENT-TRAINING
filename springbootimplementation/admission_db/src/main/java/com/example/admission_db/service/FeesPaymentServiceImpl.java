package com.example.admission_db.service;

import com.example.admission_db.entity.FeesPayment;
import com.example.admission_db.repository.FeesPaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeesPaymentServiceImpl implements FeesPaymentService {

    @Autowired
    private FeesPaymentRepository repo;

    @Override
    public FeesPayment save(FeesPayment feesPayment) {
        return repo.save(feesPayment);
    }

    @Override
    public List<FeesPayment> getAll() {
        return repo.findAll();
    }

    @Override
    public FeesPayment getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
