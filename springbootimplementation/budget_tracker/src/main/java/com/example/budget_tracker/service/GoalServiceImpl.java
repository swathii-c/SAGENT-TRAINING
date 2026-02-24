package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Goal;
import com.example.budget_tracker.repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalServiceImpl implements GoalService {

    private final GoalRepository repo;

    public GoalServiceImpl(GoalRepository repo) {
        this.repo = repo;
    }

    public Goal saveGoal(Goal goal) {
        return repo.save(goal);
    }

    public List<Goal> getAllGoals() {
        return repo.findAll();
    }

    public Goal getGoalById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteGoal(Integer id) {
        repo.deleteById(id);
    }
}
