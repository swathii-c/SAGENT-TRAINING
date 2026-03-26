import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  api.post('/users/login', { email, password });

export const registerUser = (data) =>
  api.post('/users/register', data);

// ─── USERS ────────────────────────────────────────────────────────────────────
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);

// ─── SHOWS ────────────────────────────────────────────────────────────────────
// Entity: showId, title, showType, genre, duration, language
export const getAllShows = () => api.get('/shows');
export const getShowById = (id) => api.get(`/shows/${id}`);
export const createShow = (data) => api.post('/shows', data);
export const updateShow = (id, data) => api.put(`/shows/${id}`, data);
export const deleteShow = (id) => api.delete(`/shows/${id}`);

// ─── VENUES ───────────────────────────────────────────────────────────────────
// Entity: venueId, venueName, address, city, state, capacity
export const getAllVenues = () => api.get('/venues');
export const getVenueById = (id) => api.get(`/venues/${id}`);
export const createVenue = (data) => api.post('/venues', data);
export const updateVenue = (id, data) => api.put(`/venues/${id}`, data);
export const deleteVenue = (id) => api.delete(`/venues/${id}`);

// ─── SHOW SCHEDULES ───────────────────────────────────────────────────────────
// Entity: scheduleId, showId, venueId, showDate, showTime
export const getAllSchedules = () => api.get('/schedules');
export const getScheduleById = (id) => api.get(`/schedules/${id}`);
export const getSchedulesByShow = (showId) => api.get(`/schedules/show/${showId}`);
export const createSchedule = (data) => api.post('/schedules', data);
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

// ─── SEATS ────────────────────────────────────────────────────────────────────
// Entity: seatId, seatNumber, seatType, price, venueId
export const getSeatsByVenue = (venueId) => api.get(`/seats/venue/${venueId}`);
export const createSeat = (data) => api.post('/seats', data);
export const updateSeat = (id, data) => api.put(`/seats/${id}`, data);
export const deleteSeat = (id) => api.delete(`/seats/${id}`);

// ─── SEAT LOCKS ───────────────────────────────────────────────────────────────
// Entity: lockId, seatId, userId, scheduleId, lockedAt, expiresAt, status
export const lockSeat = (seatId, userId, scheduleId) =>
  api.post(`/seats/${seatId}/lock`, { userId, scheduleId });

export const unlockSeat = (seatId, userId) =>
  api.delete(`/seats/${seatId}/lock`, { data: { userId } });

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
// Entity: bookingId, userId, scheduleId, seatNumbers, totalAmount, bookingStatus, bookingDate
export const createBooking = (data) => api.post('/bookings', data);
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const getBookingsByUser = (userId) => api.get(`/bookings/user/${userId}`);
export const getAllBookings = () => api.get('/bookings');
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
// Entity: paymentId, bookingId, amount, paymentMode, paymentStatus, paymentDate
export const processPayment = (data) => api.post('/payments', data);
export const getPaymentByBooking = (bookingId) => api.get(`/payments/booking/${bookingId}`);

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
// Entity: notificationId, userId, message, status, createdAt
export const getNotificationsByUser = (userId) => api.get(`/notifications/user/${userId}`);
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);

// ─── CANCELLATIONS ────────────────────────────────────────────────────────────
// Entity: cancellationId, bookingId, reason, refundAmount, date
export const requestCancellation = (data) => api.post('/cancellations', data);
export const getCancellationsByUser = (userId) => api.get(`/cancellations/user/${userId}`);

export default api;
