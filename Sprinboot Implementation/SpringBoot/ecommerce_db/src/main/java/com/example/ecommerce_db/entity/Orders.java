package com.example.ecommerce_db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer oId;

    private String name;
    private String contact;
    private String address;
    private Double total;

    @ManyToOne
    private User user;

    @ManyToOne
    private Cart cart;
}
