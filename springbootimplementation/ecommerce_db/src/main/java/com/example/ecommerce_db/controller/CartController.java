package com.example.ecommerce_db.controller;

import com.example.ecommerce_db.entity.Cart;
import com.example.ecommerce_db.service.CartService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/carts")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @PostMapping
    public Cart save(@RequestBody Cart cart) {
        return service.save(cart);
    }

    @GetMapping
    public List<Cart> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Cart getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
