package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Cart;
import com.example.ecommerce_db.repository.CartRepository;
import com.example.ecommerce_db.service.CartService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository repo;

    public CartServiceImpl(CartRepository repo) {
        this.repo = repo;
    }

    public Cart save(Cart cart) {
        return repo.save(cart);
    }

    public List<Cart> getAll() {
        return repo.findAll();
    }

    public Cart getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
