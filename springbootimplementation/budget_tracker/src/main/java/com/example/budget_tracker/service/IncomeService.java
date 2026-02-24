package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Income;
import java.util.List;

public interface IncomeService {

    Income saveIncome(Income income);

    List<Income> getAllIncome();

    Income getIncomeById(Integer id);

    void deleteIncome(Integer id);
}

