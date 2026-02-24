package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.Income;
import com.example.budget_tracker.service.IncomeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/income")
public class IncomeController {

    private final IncomeService service;

    public IncomeController(IncomeService service) {
        this.service = service;
    }

    @PostMapping
    public Income saveIncome(@RequestBody Income income) {
        return service.saveIncome(income);
    }

    @GetMapping
    public List<Income> getAllIncome() {
        return service.getAllIncome();
    }

    @GetMapping("/{id}")
    public Income getIncome(@PathVariable Integer id) {
        return service.getIncomeById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Integer id) {
        service.deleteIncome(id);
    }
}
