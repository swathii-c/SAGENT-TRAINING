package com.example.ecommerce_db.service;

import com.example.ecommerce_db.entity.Orders;
import java.util.List;

public interface OrdersService {
    Orders save(Orders orders);
    List<Orders> getAll();
    Orders getById(Integer id);
    void delete(Integer id);
}
