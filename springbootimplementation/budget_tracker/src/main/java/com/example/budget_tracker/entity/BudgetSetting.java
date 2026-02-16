package com.example.budget_tracker.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BudgetSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer budgetId;

    private String category;
    private Double limitAmount;
}

