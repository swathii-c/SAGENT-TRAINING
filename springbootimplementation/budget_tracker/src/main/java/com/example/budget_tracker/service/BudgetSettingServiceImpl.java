package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.BudgetSetting;
import com.example.budget_tracker.repository.BudgetSettingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetSettingServiceImpl implements BudgetSettingService {

    private final BudgetSettingRepository repo;

    public BudgetSettingServiceImpl(BudgetSettingRepository repo) {
        this.repo = repo;
    }

    public BudgetSetting saveBudget(BudgetSetting budget) {
        return repo.save(budget);
    }

    public List<BudgetSetting> getAllBudgets() {
        return repo.findAll();
    }

    public BudgetSetting getBudgetById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteBudget(Integer id) {
        repo.deleteById(id);
    }
}
