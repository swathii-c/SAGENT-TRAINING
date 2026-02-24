package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.BudgetSetting;
import com.example.budget_tracker.service.BudgetSettingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
public class BudgetSettingController {

    private final BudgetSettingService service;

    public BudgetSettingController(BudgetSettingService service) {
        this.service = service;
    }

    @PostMapping
    public BudgetSetting saveBudget(@RequestBody BudgetSetting budget) {
        return service.saveBudget(budget);
    }

    @GetMapping
    public List<BudgetSetting> getAllBudgets() {
        return service.getAllBudgets();
    }

    @GetMapping("/{id}")
    public BudgetSetting getBudget(@PathVariable Integer id) {
        return service.getBudgetById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Integer id) {
        service.deleteBudget(id);
    }
}
