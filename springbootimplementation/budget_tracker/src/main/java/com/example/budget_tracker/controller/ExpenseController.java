package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.Expense;
import com.example.budget_tracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @PostMapping
    public Expense saveExpense(@RequestBody Expense expense) {
        return service.saveExpense(expense);
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return service.getAllExpenses();
    }

    @GetMapping("/{id}")
    public Expense getExpense(@PathVariable Integer id) {
        return service.getExpenseById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Integer id) {
        service.deleteExpense(id);
    }
}
