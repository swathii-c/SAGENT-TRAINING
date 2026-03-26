package com.example.seat_booking_system.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM_EMAIL = "swathiii261@gmail.com";
    private static final String FROM_NAME = "SeatSync Bookings";

    // ── Core HTML Email Sender ────────────────────────────────────────────────
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(FROM_EMAIL, FROM_NAME);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("✅ Email sent FROM " + FROM_EMAIL + " TO " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email to " + to + ": " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Email error: " + e.getMessage());
        }
    }

    // ── Booking Confirmation Email ────────────────────────────────────────────
    public void sendBookingConfirmation(String to, String userName, Long bookingId,
                                        String showTitle, String showDate, String showTime,
                                        String venueName, String seatNumbers,
                                        double totalAmount, String paymentMode) {

        String subject = "🎫 Booking Confirmed — " + showTitle + " | SeatSync";
        String html =
                "<!DOCTYPE html><html><head><meta charset='UTF-8'></head>" +
                        "<body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>" +
                        "<div style='max-width:600px;margin:0 auto;padding:32px 16px;'>" +
                        "<div style='background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);'>" +
                        "<div style='background:linear-gradient(135deg,#0a0a0f,#1a1206);padding:32px;text-align:center;'>" +
                        "<h1 style='color:#d4af37;font-size:28px;margin:0 0 8px;'>🎭 SeatSync</h1>" +
                        "<p style='color:#8a8690;margin:0;font-size:14px;'>Your booking is confirmed!</p>" +
                        "</div>" +
                        "<div style='padding:20px 32px 0;text-align:center;'>" +
                        "<div style='display:inline-block;background:#e8f8f5;border:1px solid #1abc9c;border-radius:20px;padding:8px 20px;'>" +
                        "<span style='color:#1abc9c;font-size:13px;font-weight:700;letter-spacing:1px;'>✓ BOOKING CONFIRMED</span>" +
                        "</div></div>" +
                        "<div style='padding:24px 32px 32px;'>" +
                        "<p style='color:#333;font-size:16px;margin:0 0 20px;'>Hi <strong>" + userName + "</strong>, your seats are locked in! See you at the show. 🎉</p>" +
                        "<div style='background:#fffbf0;border:2px solid #d4af37;border-radius:10px;padding:16px;text-align:center;margin-bottom:24px;'>" +
                        "<p style='color:#888;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;'>Booking ID</p>" +
                        "<span style='color:#d4af37;font-size:30px;font-weight:900;font-family:monospace;letter-spacing:4px;'>#" + bookingId + "</span>" +
                        "</div>" +
                        "<p style='color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;'>Show Details</p>" +
                        "<table style='width:100%;border-collapse:collapse;margin-bottom:20px;'>" +
                        "<tr>" +
                        "<td style='background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:12px 14px;width:48%;'>" +
                        "<div style='color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;'>Show</div>" +
                        "<div style='color:#333;font-size:14px;font-weight:700;'>" + showTitle + "</div></td>" +
                        "<td style='width:4%;'></td>" +
                        "<td style='background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:12px 14px;width:48%;'>" +
                        "<div style='color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;'>Venue</div>" +
                        "<div style='color:#333;font-size:14px;font-weight:700;'>" + venueName + "</div></td>" +
                        "</tr>" +
                        "<tr><td colspan='3' style='height:8px;'></td></tr>" +
                        "<tr>" +
                        "<td style='background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:12px 14px;'>" +
                        "<div style='color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;'>Date</div>" +
                        "<div style='color:#333;font-size:14px;font-weight:700;'>" + showDate + "</div></td>" +
                        "<td style='width:4%;'></td>" +
                        "<td style='background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:12px 14px;'>" +
                        "<div style='color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;'>Time</div>" +
                        "<div style='color:#333;font-size:14px;font-weight:700;'>" + showTime + "</div></td>" +
                        "</tr></table>" +
                        "<p style='color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 10px;'>Your Seats</p>" +
                        "<div style='background:#f8f9fa;border:1px solid #e0e0e0;border-radius:10px;padding:14px 16px;margin-bottom:24px;'>" +
                        buildSeatChipsHtml(seatNumbers) +
                        "</div>" +
                        "<hr style='border:none;border-top:1px solid #e0e0e0;margin:0 0 20px;'/>" +
                        "<p style='color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;'>Payment Summary</p>" +
                        "<table style='width:100%;'><tr>" +
                        "<td style='background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:12px 14px;'>" +
                        "<div style='color:#888;font-size:11px;margin-bottom:4px;'>Payment Method</div>" +
                        "<div style='color:#333;font-weight:700;'>" + paymentMode + "</div></td>" +
                        "<td style='width:4%;'></td>" +
                        "<td style='background:#fffbf0;border:2px solid #d4af37;border-radius:8px;padding:12px 14px;text-align:right;'>" +
                        "<div style='color:#888;font-size:11px;margin-bottom:4px;'>Total Paid</div>" +
                        "<div style='color:#d4af37;font-size:22px;font-weight:900;'>₹" + String.format("%.0f", totalAmount) + "</div></td>" +
                        "</tr></table>" +
                        "</div>" +
                        "<div style='background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e0e0e0;'>" +
                        "<p style='color:#aaa;font-size:12px;margin:4px 0;'>This email was sent from SeatSync Admin — " + FROM_EMAIL + "</p>" +
                        "<p style='color:#aaa;font-size:12px;margin:4px 0;'>🔒 Automated email. Do not reply.</p>" +
                        "</div>" +
                        "</div></div></body></html>";

        sendHtmlEmail(to, subject, html);
    }

    // ── Cancellation + Refund Email ───────────────────────────────────────────
    public void sendCancellationConfirmation(String to, String userName, Long bookingId,
                                             String showTitle, String showDate,
                                             double originalAmount, double refundAmount,
                                             String reason) {

        String subject = "❌ Booking #" + bookingId + " Cancelled — Refund Update | SeatSync";
        boolean hasRefund = refundAmount > 0;
        double deduction = originalAmount - refundAmount;
        String refundPercent = originalAmount > 0
                ? String.format("%.0f", (refundAmount / originalAmount) * 100) + "%" : "0%";

        String html =
                "<!DOCTYPE html><html><head><meta charset='UTF-8'></head>" +
                        "<body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>" +
                        "<div style='max-width:600px;margin:0 auto;padding:32px 16px;'>" +
                        "<div style='background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);'>" +
                        "<div style='background:linear-gradient(135deg,#1a0606,#0d0d14);padding:32px;text-align:center;'>" +
                        "<h1 style='color:#d4af37;font-size:28px;margin:0 0 8px;'>🎭 SeatSync</h1>" +
                        "<p style='color:#8a8690;margin:0;font-size:14px;'>Booking Cancellation Confirmation</p>" +
                        "</div>" +
                        "<div style='padding:32px;'>" +
                        "<p style='color:#333;font-size:16px;margin:0 0 20px;'>Hi <strong>" + userName + "</strong>, your booking has been cancelled as requested.</p>" +
                        "<div style='background:#fff5f5;border:2px solid #e74c3c;border-radius:10px;padding:16px;text-align:center;margin-bottom:24px;'>" +
                        "<p style='color:#888;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;'>Cancelled Booking ID</p>" +
                        "<span style='color:#e74c3c;font-size:30px;font-weight:900;font-family:monospace;letter-spacing:4px;'>#" + bookingId + "</span>" +
                        "</div>" +
                        "<div style='border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;" +
                        (hasRefund ? "background:#f0fff8;border:2px solid #1abc9c;" : "background:#fff5f5;border:2px solid #e74c3c;") + "'>" +
                        "<p style='font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;color:" +
                        (hasRefund ? "#1abc9c" : "#e74c3c") + ";'>" +
                        (hasRefund ? "✅ Refund Approved" : "❌ No Refund Applicable") + "</p>" +
                        "<div style='font-size:48px;font-weight:900;color:" + (hasRefund ? "#1abc9c" : "#e74c3c") + ";font-family:monospace;margin:8px 0;'>₹" + String.format("%.0f", refundAmount) + "</div>" +
                        "<p style='color:#666;font-size:13px;margin:8px 0 0;'>" +
                        (hasRefund ? "Will be credited to your original payment method within <strong>5–7 business days</strong>" : "No refund applicable as per our cancellation policy") +
                        "</p></div>" +
                        "<p style='color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;'>Cancelled Show</p>" +
                        "<table style='width:100%;border-collapse:collapse;margin-bottom:20px;'>" +
                        "<tr><td style='background:#f8f9fa;border:1px solid #e0e0e0;padding:12px 14px;border-radius:8px;'>" +
                        "<span style='color:#888;font-size:13px;'>Show</span><span style='float:right;color:#333;font-weight:700;'>" + showTitle + "</span></td></tr>" +
                        "<tr><td style='height:6px;'></td></tr>" +
                        "<tr><td style='background:#f8f9fa;border:1px solid #e0e0e0;padding:12px 14px;border-radius:8px;'>" +
                        "<span style='color:#888;font-size:13px;'>Show Date</span><span style='float:right;color:#333;font-weight:700;'>" + showDate + "</span></td></tr>" +
                        (reason != null && !reason.isEmpty()
                                ? "<tr><td style='height:6px;'></td></tr><tr><td style='background:#f8f9fa;border:1px solid #e0e0e0;padding:12px 14px;border-radius:8px;'><span style='color:#888;font-size:13px;'>Reason</span><span style='float:right;color:#333;font-weight:700;'>" + reason + "</span></td></tr>"
                                : "") +
                        "</table>" +
                        "<hr style='border:none;border-top:1px solid #e0e0e0;margin:0 0 20px;'/>" +
                        "<p style='color:#888;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;'>Refund Breakdown</p>" +
                        "<table style='width:100%;'>" +
                        "<tr><td style='color:#666;font-size:14px;padding:6px 0;'>Original Amount Paid</td><td style='text-align:right;color:#333;font-weight:600;'>₹" + String.format("%.0f", originalAmount) + "</td></tr>" +
                        "<tr><td style='color:#e74c3c;font-size:14px;padding:6px 0;'>Cancellation Charge</td><td style='text-align:right;color:#e74c3c;font-weight:600;'>− ₹" + String.format("%.0f", deduction) + "</td></tr>" +
                        "<tr><td colspan='2'><hr style='border:none;border-top:1px solid #e0e0e0;margin:8px 0;'/></td></tr>" +
                        "<tr><td style='color:" + (hasRefund ? "#1abc9c" : "#e74c3c") + ";font-size:16px;font-weight:800;padding:6px 0;'>Refund (" + refundPercent + ")</td>" +
                        "<td style='text-align:right;color:" + (hasRefund ? "#1abc9c" : "#e74c3c") + ";font-size:18px;font-weight:900;'>₹" + String.format("%.0f", refundAmount) + "</td></tr>" +
                        "</table>" +
                        "<div style='background:#fffbf0;border:1px solid #d4af37;border-radius:10px;padding:16px;margin-top:24px;'>" +
                        "<p style='color:#d4af37;font-size:12px;font-weight:700;margin:0 0 8px;'>📋 Cancellation Policy</p>" +
                        "<p style='color:#888;font-size:12px;margin:3px 0;'>• Cancel 48+ hrs before show → 100% refund</p>" +
                        "<p style='color:#888;font-size:12px;margin:3px 0;'>• Cancel 24–48 hrs before show → 75% refund</p>" +
                        "<p style='color:#888;font-size:12px;margin:3px 0;'>• Cancel 2–24 hrs before show → 50% refund</p>" +
                        "<p style='color:#888;font-size:12px;margin:3px 0;'>• Cancel within 2 hrs of show → No refund</p>" +
                        "</div>" +
                        "</div>" +
                        "<div style='background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e0e0e0;'>" +
                        "<p style='color:#aaa;font-size:12px;margin:4px 0;'>This email was sent from SeatSync Admin — " + FROM_EMAIL + "</p>" +
                        "<p style='color:#aaa;font-size:12px;margin:4px 0;'>🔒 Automated email. Do not reply.</p>" +
                        "</div>" +
                        "</div></div></body></html>";

        sendHtmlEmail(to, subject, html);
    }

    // ── Password Reset Email ──────────────────────────────────────────────────
    public void sendPasswordResetEmail(String to, String userName, String resetLink) {
        String subject = "🔐 Reset Your SeatSync Password";
        String html =
                "<!DOCTYPE html><html><head><meta charset='UTF-8'></head>" +
                        "<body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>" +
                        "<div style='max-width:600px;margin:0 auto;padding:32px 16px;'>" +
                        "<div style='background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);'>" +
                        "<div style='background:linear-gradient(135deg,#0a0a0f,#1a1206);padding:32px;text-align:center;'>" +
                        "<h1 style='color:#d4af37;font-size:28px;margin:0 0 8px;'>🎭 SeatSync</h1>" +
                        "<p style='color:#8a8690;margin:0;font-size:14px;'>Password Reset Request</p>" +
                        "</div>" +
                        "<div style='padding:32px;'>" +
                        "<p style='color:#333;font-size:16px;margin:0 0 16px;'>Hi <strong>" + userName + "</strong>,</p>" +
                        "<p style='color:#666;font-size:14px;margin:0 0 24px;'>We received a request to reset your SeatSync password. Click the button below to create a new password. This link will expire in <strong>30 minutes</strong>.</p>" +
                        "<div style='text-align:center;margin:32px 0;'>" +
                        "<a href='" + resetLink + "' style='background:linear-gradient(135deg,#d4af37,#b8960a);color:#0a0a0f;padding:14px 36px;border-radius:10px;font-size:16px;font-weight:700;text-decoration:none;display:inline-block;'>Reset My Password</a>" +
                        "</div>" +
                        "<p style='color:#888;font-size:13px;margin:0 0 8px;'>Or copy this link:</p>" +
                        "<div style='background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:12px;word-break:break-all;'>" +
                        "<span style='color:#d4af37;font-size:12px;'>" + resetLink + "</span>" +
                        "</div>" +
                        "<div style='background:#fff8e1;border:1px solid #ffd54f;border-radius:8px;padding:14px;margin-top:24px;'>" +
                        "<p style='color:#f57f17;font-size:13px;margin:0;'>⚠️ If you did not request a password reset, please ignore this email.</p>" +
                        "</div>" +
                        "</div>" +
                        "<div style='background:#f8f9fa;padding:20px 32px;text-align:center;border-top:1px solid #e0e0e0;'>" +
                        "<p style='color:#aaa;font-size:12px;margin:4px 0;'>This email was sent from SeatSync Admin — " + FROM_EMAIL + "</p>" +
                        "<p style='color:#aaa;font-size:12px;margin:4px 0;'>🔒 Automated email. Do not reply.</p>" +
                        "</div>" +
                        "</div></div></body></html>";

        sendHtmlEmail(to, subject, html);
    }

    // ── Helper: seat chips with type label ────────────────────────────────────
    private String buildSeatChipsHtml(String seatNumbers) {
        if (seatNumbers == null || seatNumbers.isEmpty()) return "<span>—</span>";
        StringBuilder sb = new StringBuilder();
        for (String seat : seatNumbers.split(",")) {
            String s = seat.trim();
            // Determine type and color based on row letter
            String row = s.replaceAll("[^A-Za-z]", "").toUpperCase();
            String bgColor, borderColor, textColor, typeLabel;
            if (row.equals("A") || row.equals("B")) {
                bgColor = "#f0e6ff"; borderColor = "#9b59b6"; textColor = "#6c3483"; typeLabel = "PREMIUM";
            } else if (row.equals("C") || row.equals("D")) {
                bgColor = "#fffbf0"; borderColor = "#d4af37"; textColor = "#7d6608"; typeLabel = "VIP";
            } else {
                bgColor = "#d5f5ee"; borderColor = "#1abc9c"; textColor = "#0e8c72"; typeLabel = "STANDARD";
            }
            sb.append("<span style='display:inline-block;background:").append(bgColor)
                    .append(";border:1px solid ").append(borderColor)
                    .append(";border-radius:8px;padding:8px 14px;font-size:13px;font-weight:700;color:")
                    .append(textColor).append(";margin:4px;text-align:center;min-width:60px;'>")
                    .append("<div style='font-size:16px;font-weight:900;'>").append(s).append("</div>")
                    .append("<div style='font-size:10px;letter-spacing:0.5px;margin-top:2px;font-weight:600;'>").append(typeLabel).append("</div>")
                    .append("</span>");
        }
        return sb.toString();
    }
}