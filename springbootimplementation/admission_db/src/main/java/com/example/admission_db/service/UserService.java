package com.example.admission_db.service;

import com.example.admission_db.entity.User;
import java.util.List;

public interface UserService {

    User save(User user);

    List<User> getAll();

    User getById(Integer id);

    void delete(Integer id);
}
