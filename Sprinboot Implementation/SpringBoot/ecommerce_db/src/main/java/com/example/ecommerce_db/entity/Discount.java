package com.example.ecommerce_db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dId;

    private String offerType;
}
