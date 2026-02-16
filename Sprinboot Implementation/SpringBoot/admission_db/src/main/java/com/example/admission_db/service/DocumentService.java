package com.example.admission_db.service;

import com.example.admission_db.entity.Document;
import java.util.List;

public interface DocumentService {

    Document save(Document document);

    List<Document> getAll();

    Document getById(Integer id);

    void delete(Integer id);
}
