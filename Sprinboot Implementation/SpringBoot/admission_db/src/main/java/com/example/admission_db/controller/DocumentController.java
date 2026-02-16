package com.example.admission_db.controller;

import com.example.admission_db.entity.Document;
import com.example.admission_db.service.DocumentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    private DocumentService service;

    // ✅ Create Document
    @PostMapping
    public Document save(@RequestBody Document document) {
        return service.save(document);
    }

    // ✅ Get All Documents
    @GetMapping
    public List<Document> getAll() {
        return service.getAll();
    }

    // ✅ Get Document By ID
    @GetMapping("/{id}")
    public Document getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // ✅ Delete Document
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
