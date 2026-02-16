package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.Goal;
import java.util.List;

public interface GoalService {

    Goal saveGoal(Goal goal);

    List<Goal> getAllGoals();

    Goal getGoalById(Integer id);

    void deleteGoal(Integer id);
}
