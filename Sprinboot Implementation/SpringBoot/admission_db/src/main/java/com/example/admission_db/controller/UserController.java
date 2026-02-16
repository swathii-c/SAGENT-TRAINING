package com.example.admission_db.controller;

import com.example.admission_db.entity.User;
import com.example.admission_db.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    // ✅ Create User
    @PostMapping
    public User save(@RequestBody User user) {
        return service.save(user);
    }

    // ✅ Get All Users
    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }

    // ✅ Get User By ID
    @GetMapping("/{id}")
    public User getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // ✅ Delete User
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
