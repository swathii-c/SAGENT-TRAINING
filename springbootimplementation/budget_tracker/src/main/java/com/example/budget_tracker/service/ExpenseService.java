package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Expense;
import java.util.List;

public interface ExpenseService {

    Expense saveExpense(Expense expense);

    List<Expense> getAllExpenses();

    Expense getExpenseById(Integer id);

    void deleteExpense(Integer id);
}
