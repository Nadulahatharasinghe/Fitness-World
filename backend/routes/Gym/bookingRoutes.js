import express from 'express';
import {
  getMyBookings, createBooking, cancelBooking,
  getAllBookings, updateBookingStatus
} from '../../controllers/Gym/bookingController.js';
import { auth, adminAuth } from '../../middleware/Auth.js';

const router = express.Router();

// Member routes
router.get('/my', auth, getMyBookings);
router.post('/', auth, createBooking);
router.put('/:id/cancel', auth, cancelBooking);

// Admin routes
router.get('/admin/all', adminAuth, getAllBookings);
router.put('/admin/:id/status', adminAuth, updateBookingStatus);

export default router;
