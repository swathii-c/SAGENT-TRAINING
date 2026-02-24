package com.example.admission_db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class FeesPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feesPaymentId;

    private String payMethod;
    private String status;

    @OneToOne
    @JoinColumn(name = "form_id")
    private Application application;
}
