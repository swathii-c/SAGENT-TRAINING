package com.example.admission_db.service;

import com.example.admission_db.entity.Document;
import com.example.admission_db.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository repo;

    @Override
    public Document save(Document document) {
        return repo.save(document);
    }

    @Override
    public List<Document> getAll() {
        return repo.findAll();
    }

    @Override
    public Document getById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
