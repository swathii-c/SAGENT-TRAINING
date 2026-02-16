package com.example.ecommerce_db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer payId;

    private String paymentMethod;
    private String receipt;
    private String status;

    @ManyToOne
    private User user;

    @ManyToOne
    private Orders order;
}
