package com.example.admission_db.service;

import com.example.admission_db.entity.Application;
import com.example.admission_db.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private ApplicationRepository repo;

    @Override
    public Application save(Application app) {
        return repo.save(app);
    }

    @Override
    public List<Application> getAll() {
        return repo.findAll();
    }

    @Override
    public Application getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
