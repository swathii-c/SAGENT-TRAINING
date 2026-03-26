package com.example.seat_booking_system.service;

import com.example.seat_booking_system.entity.Booking;
import com.example.seat_booking_system.entity.Notification;
import com.example.seat_booking_system.entity.ShowSchedule;
import com.example.seat_booking_system.entity.User;
import com.example.seat_booking_system.Repository.BookingRepository;
import com.example.seat_booking_system.Repository.NotificationRepository;
import com.example.seat_booking_system.Repository.ShowScheduleRepository;
import com.example.seat_booking_system.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShowScheduleRepository showScheduleRepository;

    @Autowired
    private ShowsService showsService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationRepository notificationRepository;

    public Booking createBooking(Booking booking) {
        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingStatus("CONFIRMED");

        // ── Remove duplicate seat numbers ──────────────────────────────────────
        if (booking.getSeatNumbers() != null) {
            List<String> uniqueSeats = booking.getSeatNumbers()
                    .stream()
                    .distinct()
                    .collect(Collectors.toList());
            booking.setSeatNumbers(uniqueSeats);
        }

        // Step 1: Save booking
        Booking savedBooking = bookingRepository.save(booking);

        // Step 2: Save notification
        try {
            Notification notification = new Notification();
            notification.setUserId(booking.getUserId());
            notification.setMessage("Booking #" + savedBooking.getBookingId() +
                    " confirmed! Seats: " + String.join(", ", booking.getSeatNumbers()));
            notification.setStatus("SENT");
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.err.println("Notification error: " + e.getMessage());
        }

        // Step 3: Send confirmation email
        try {
            User user = userRepository.findById(booking.getUserId()).orElse(null);
            ShowSchedule schedule = showScheduleRepository
                    .findById(booking.getScheduleId()).orElse(null);

            if (user != null && schedule != null && user.getEmail() != null) {
                String showTitle = "Show #" + booking.getScheduleId();
                var show = showsService.getShowById(schedule.getShowId());
                if (show != null) showTitle = show.getTitle();

                String seatNumbers = String.join(", ", booking.getSeatNumbers());

                emailService.sendBookingConfirmation(
                        user.getEmail(),
                        user.getName(),
                        savedBooking.getBookingId(),
                        showTitle,
                        schedule.getShowDate().toString(),
                        schedule.getShowTime().toString(),
                        "Venue #" + schedule.getVenueId(),
                        seatNumbers,
                        booking.getTotalAmount(),
                        "UPI"
                );
            }
        } catch (Exception e) {
            System.err.println("❌ Email error: " + e.getMessage());
        }

        return savedBooking;
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setBookingStatus("CANCELLED");
            return bookingRepository.save(booking);
        }
        return null;
    }
}