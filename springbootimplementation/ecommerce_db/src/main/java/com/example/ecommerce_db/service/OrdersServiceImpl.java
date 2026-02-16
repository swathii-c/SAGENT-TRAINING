package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Orders;
import com.example.ecommerce_db.repository.OrdersRepository;
import com.example.ecommerce_db.service.OrdersService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrdersServiceImpl implements OrdersService {

    private final OrdersRepository repo;

    public OrdersServiceImpl(OrdersRepository repo) {
        this.repo = repo;
    }

    public Orders save(Orders orders) {
        return repo.save(orders);
    }

    public List<Orders> getAll() {
        return repo.findAll();
    }

    public Orders getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
