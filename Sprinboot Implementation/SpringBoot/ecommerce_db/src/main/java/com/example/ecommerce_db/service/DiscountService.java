package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Discount;
import java.util.List;

public interface DiscountService {
    Discount save(Discount discount);
    List<Discount> getAll();
    Discount getById(Integer id);
    void delete(Integer id);
}
