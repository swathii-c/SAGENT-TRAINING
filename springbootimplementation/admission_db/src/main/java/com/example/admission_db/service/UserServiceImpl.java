package com.example.admission_db.service;

import com.example.admission_db.entity.User;
import com.example.admission_db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository repo;

    @Override
    public User save(User user) {
        return repo.save(user);
    }

    @Override
    public List<User> getAll() {
        return repo.findAll();
    }

    @Override
    public User getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
