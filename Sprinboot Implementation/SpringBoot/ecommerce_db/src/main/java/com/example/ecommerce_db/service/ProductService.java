package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Product;
import java.util.List;

public interface ProductService {
    Product save(Product product);
    List<Product> getAll();
    Product getById(Integer id);
    void delete(Integer id);
}
