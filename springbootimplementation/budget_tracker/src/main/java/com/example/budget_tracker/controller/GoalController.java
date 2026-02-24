package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.Goal;
import com.example.budget_tracker.service.GoalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    private final GoalService service;

    public GoalController(GoalService service) {
        this.service = service;
    }

    @PostMapping
    public Goal saveGoal(@RequestBody Goal goal) {
        return service.saveGoal(goal);
    }

    @GetMapping
    public List<Goal> getAllGoals() {
        return service.getAllGoals();
    }

    @GetMapping("/{id}")
    public Goal getGoal(@PathVariable Integer id) {
        return service.getGoalById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Integer id) {
        service.deleteGoal(id);
    }
}
