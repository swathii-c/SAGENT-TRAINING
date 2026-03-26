package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.Notification;
import com.example.seat_booking_system.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(Notification notification){

        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus("SENT");

        return notificationRepository.save(notification);
    }
    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // ✅ ADD THIS
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setStatus("READ");
            return notificationRepository.save(notification);
        }
        return null;
    }
}