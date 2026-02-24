package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Expense;
import com.example.budget_tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repo;

    public ExpenseServiceImpl(ExpenseRepository repo) {
        this.repo = repo;
    }

    public Expense saveExpense(Expense expense) {
        return repo.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return repo.findAll();
    }

    public Expense getExpenseById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteExpense(Integer id) {
        repo.deleteById(id);
    }
}
