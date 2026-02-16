package com.example.admission_db.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DesiredCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseId;

    private String courseType;
    private String duration;
}
