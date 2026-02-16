package com.example.admission_db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.admission_db.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
}

