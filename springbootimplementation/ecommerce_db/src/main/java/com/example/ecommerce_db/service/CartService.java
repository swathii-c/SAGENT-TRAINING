package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Cart;
import java.util.List;

public interface CartService {
    Cart save(Cart cart);
    List<Cart> getAll();
    Cart getById(Integer id);
    void delete(Integer id);
}

