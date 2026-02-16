package com.example.admission_db.service;

import com.example.admission_db.entity.FeesPayment;
import java.util.List;

public interface FeesPaymentService {

    FeesPayment save(FeesPayment feesPayment);

    List<FeesPayment> getAll();

    FeesPayment getById(Integer id);

    void delete(Integer id);
}
