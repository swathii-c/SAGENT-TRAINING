package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Income;
import com.example.budget_tracker.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository repo;

    public IncomeServiceImpl(IncomeRepository repo) {
        this.repo = repo;
    }

    public Income saveIncome(Income income) {
        return repo.save(income);
    }

    public List<Income> getAllIncome() {
        return repo.findAll();
    }

    public Income getIncomeById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteIncome(Integer id) {
        repo.deleteById(id);
    }
}

