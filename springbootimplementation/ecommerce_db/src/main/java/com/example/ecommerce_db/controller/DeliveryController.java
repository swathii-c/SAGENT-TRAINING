package com.example.ecommerce_db.controller;

import com.example.ecommerce_db.entity.Delivery;
import com.example.ecommerce_db.service.DeliveryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    private final DeliveryService service;

    public DeliveryController(DeliveryService service) {
        this.service = service;
    }

    @PostMapping
    public Delivery save(@RequestBody Delivery delivery) {
        return service.save(delivery);
    }

    @GetMapping
    public List<Delivery> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Delivery getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
