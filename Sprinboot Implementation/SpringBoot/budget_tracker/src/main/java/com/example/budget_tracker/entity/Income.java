package com.example.budget_tracker.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer incomeId;

    private String source;
    private Double amount;
}
