package com.example.ecommerce_db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dId;

    private String personName;
    private String status;
    private String notification;

    @ManyToOne
    private User user;

    @ManyToOne
    private Payment payment;
}
