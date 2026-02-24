package com.example.budget_tracker.repository;

import com.example.budget_tracker.entity.BudgetSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetSettingRepository extends JpaRepository<BudgetSetting, Integer> {
}
