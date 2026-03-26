package com.example.seat_booking_system.Controller;

import com.example.seat_booking_system.entity.Notification;
import com.example.seat_booking_system.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
@RestController
@RequestMapping("/notifications")
public class Notificationcontroller {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public Notification sendNotification(@RequestBody Notification notification){
        return notificationService.sendNotification(notification);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) { return ResponseEntity.ok(notificationService.getNotificationsByUser(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) { Notification notification = notificationService.markAsRead(id);
        if (notification == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(notification);}
}