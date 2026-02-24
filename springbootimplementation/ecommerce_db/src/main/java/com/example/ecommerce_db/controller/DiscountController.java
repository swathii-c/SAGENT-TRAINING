package com.example.ecommerce_db.controller;

import com.example.ecommerce_db.entity.Discount;
import com.example.ecommerce_db.service.DiscountService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/discounts")
public class DiscountController {

    private final DiscountService service;

    public DiscountController(DiscountService service) {
        this.service = service;
    }

    @PostMapping
    public Discount save(@RequestBody Discount discount) {
        return service.save(discount);
    }

    @GetMapping
    public List<Discount> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Discount getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
