package com.example.ecommerce_db.controller;

import com.example.ecommerce_db.entity.Orders;
import com.example.ecommerce_db.service.OrdersService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    private final OrdersService service;

    public OrdersController(OrdersService service) {
        this.service = service;
    }

    @PostMapping
    public Orders save(@RequestBody Orders orders) {
        return service.save(orders);
    }

    @GetMapping
    public List<Orders> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Orders getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
