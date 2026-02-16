package com.example.budget_tracker.service;

import com.example.budget_tracker.entity.User;
import java.util.List;

public interface UserService {

    User saveUser(User user);
    List<User> getAllUsers();
    User getUserById(Integer id);
    void deleteUser(Integer id);
}
