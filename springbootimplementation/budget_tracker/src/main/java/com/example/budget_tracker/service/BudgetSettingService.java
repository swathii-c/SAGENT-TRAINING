package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.BudgetSetting;
import java.util.List;

public interface BudgetSettingService {

    BudgetSetting saveBudget(BudgetSetting budget);

    List<BudgetSetting> getAllBudgets();

    BudgetSetting getBudgetById(Integer id);

    void deleteBudget(Integer id);
}
