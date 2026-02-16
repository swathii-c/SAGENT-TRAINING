package com.example.admission_db.service;

import com.example.admission_db.entity.Application;
import java.util.List;

public interface ApplicationService {

    Application save(Application app);

    List<Application> getAll();

    Application getById(Integer id);

    void delete(Integer id);
}
