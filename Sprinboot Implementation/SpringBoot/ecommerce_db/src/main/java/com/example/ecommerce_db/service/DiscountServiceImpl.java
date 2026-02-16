package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Discount;
import com.example.ecommerce_db.repository.DiscountRepository;
import com.example.ecommerce_db.service.DiscountService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository repo;

    public DiscountServiceImpl(DiscountRepository repo) {
        this.repo = repo;
    }

    public Discount save(Discount discount) {
        return repo.save(discount);
    }

    public List<Discount> getAll() {
        return repo.findAll();
    }

    public Discount getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
