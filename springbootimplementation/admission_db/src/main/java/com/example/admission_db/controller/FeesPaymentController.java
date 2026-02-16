package com.example.admission_db.controller;

import com.example.admission_db.entity.FeesPayment;
import com.example.admission_db.service.FeesPaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fees")
public class FeesPaymentController {

    @Autowired
    private FeesPaymentService service;

    // ✅ Create Fees Payment
    @PostMapping
    public FeesPayment save(@RequestBody FeesPayment feesPayment) {
        return service.save(feesPayment);
    }

    // ✅ Get All Fees Payments
    @GetMapping
    public List<FeesPayment> getAll() {
        return service.getAll();
    }

    // ✅ Get Fees Payment By ID
    @GetMapping("/{id}")
    public FeesPayment getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // ✅ Delete Fees Payment
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
