package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.Booking;
import com.example.seat_booking_system.entity.Cancellation;
import com.example.seat_booking_system.entity.Notification;
import com.example.seat_booking_system.entity.Payments;
import com.example.seat_booking_system.entity.ShowSchedule;
import com.example.seat_booking_system.entity.User;
import com.example.seat_booking_system.Repository.BookingRepository;
import com.example.seat_booking_system.Repository.CancellationRepository;
import com.example.seat_booking_system.Repository.NotificationRepository;
import com.example.seat_booking_system.Repository.PaymentsRepository;
import com.example.seat_booking_system.Repository.ShowScheduleRepository;
import com.example.seat_booking_system.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CancellationService {

    @Autowired private CancellationRepository cancellationRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private PaymentsRepository paymentsRepository;
    @Autowired private ShowScheduleRepository showScheduleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ShowsService showsService;
    @Autowired private EmailService emailService;
    @Autowired private NotificationRepository notificationRepository;

    public Cancellation cancelBooking(Cancellation cancellation) {

        cancellation.setDate(LocalDateTime.now());

        // Step 1: Find booking
        Booking booking = bookingRepository
                .findById(cancellation.getBookingId()).orElse(null);

        if (booking == null) {
            cancellation.setRefundAmount(0);
            return cancellationRepository.save(cancellation);
        }

        double totalAmount = booking.getTotalAmount();
        double refundAmount = 0;
        String showTitle = "Show #" + booking.getScheduleId();
        String showDate = "—";

        // Step 2: Find schedule and calculate refund
        ShowSchedule schedule = showScheduleRepository
                .findById(booking.getScheduleId()).orElse(null);

        if (schedule != null) {
            showDate = schedule.getShowDate().toString();

            // Get show title
            try {
                var show = showsService.getShowById(schedule.getShowId());
                if (show != null) showTitle = show.getTitle();
            } catch (Exception e) {
                System.err.println("Could not get show title: " + e.getMessage());
            }

            // Calculate refund based on hours until show
            LocalDateTime showDateTime = LocalDateTime.of(
                    schedule.getShowDate(), schedule.getShowTime());
            long hoursUntilShow = ChronoUnit.HOURS.between(
                    LocalDateTime.now(), showDateTime);

            if (hoursUntilShow > 48) {
                refundAmount = totalAmount * 1.00; // 100%
            } else if (hoursUntilShow > 24) {
                refundAmount = totalAmount * 0.75; // 75%
            } else if (hoursUntilShow > 2) {
                refundAmount = totalAmount * 0.50; // 50%
            } else {
                refundAmount = 0; // No refund
            }
        } else {
            refundAmount = totalAmount * 0.90; // Default 90%
        }

        // Round to 2 decimal places
        refundAmount = Math.round(refundAmount * 100.0) / 100.0;
        cancellation.setRefundAmount(refundAmount);

        // Step 3: Update booking status to CANCELLED
        booking.setBookingStatus("CANCELLED");
        bookingRepository.save(booking);

        // Step 4: Update payment status
        List<Payments> payments = paymentsRepository
                .findByBookingId(booking.getBookingId());
        for (Payments p : payments) {
            p.setPaymentStatus(refundAmount > 0 ? "REFUNDED" : "NO_REFUND");
            paymentsRepository.save(p);
        }

        // Step 5: Save cancellation record
        Cancellation saved = cancellationRepository.save(cancellation);

        // Step 6: Save notification
        try {
            User user = userRepository.findById(booking.getUserId()).orElse(null);
            if (user != null) {
                Notification notification = new Notification();
                notification.setUserId(booking.getUserId());
                notification.setMessage("Booking #" + booking.getBookingId() +
                        " cancelled. Refund of ₹" +
                        String.format("%.0f", refundAmount) +
                        " will be processed in 5-7 business days.");
                notification.setStatus("SENT");
                notification.setCreatedAt(LocalDateTime.now());
                notificationRepository.save(notification);
            }
        } catch (Exception e) {
            System.err.println("Notification error: " + e.getMessage());
        }

        // Step 7: Send cancellation email
        try {
            User user = userRepository.findById(booking.getUserId()).orElse(null);
            if (user != null && user.getEmail() != null) {
                emailService.sendCancellationConfirmation(
                        user.getEmail(),
                        user.getName(),
                        booking.getBookingId(),
                        showTitle,
                        showDate,
                        totalAmount,
                        refundAmount,
                        cancellation.getReason()
                );
                System.out.println("✅ Cancellation email sent to: " + user.getEmail());
            }
        } catch (Exception e) {
            System.err.println("❌ Cancellation email error: " + e.getMessage());
        }

        return saved;
    }

    public List<Cancellation> getAllCancellations() {
        return cancellationRepository.findAll();
    }

    public Cancellation getCancellationById(Long id) {
        return cancellationRepository.findById(id).orElse(null);
    }
}