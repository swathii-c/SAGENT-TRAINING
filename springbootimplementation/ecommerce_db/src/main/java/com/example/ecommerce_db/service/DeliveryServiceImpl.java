package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Delivery;
import com.example.ecommerce_db.repository.DeliveryRepository;
import com.example.ecommerce_db.service.DeliveryService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository repo;

    public DeliveryServiceImpl(DeliveryRepository repo) {
        this.repo = repo;
    }

    public Delivery save(Delivery delivery) {
        return repo.save(delivery);
    }

    public List<Delivery> getAll() {
        return repo.findAll();
    }

    public Delivery getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}

