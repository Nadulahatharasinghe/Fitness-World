import Booking from '../../models/Gym/Booking.js';

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ member: req.userId })
      .populate('trainer', 'name specialization avatar')
      .populate('plan', 'name price')
      .sort({ sessionDate: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings.', error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, member: req.userId });
    await booking.save();
    res.status(201).json({ message: 'Booking created successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking.', error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, member: req.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.status === 'completed') return res.status(400).json({ message: 'Cannot cancel a completed booking.' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking.', error: error.message });
  }
};

// Admin only
export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const bookings = await Booking.find(query)
      .populate('member', 'firstName lastName email')
      .populate('trainer', 'name specialization')
      .sort({ sessionDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Booking.countDocuments(query);
    res.json({ bookings, total, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings.', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ message: 'Booking status updated.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking.', error: error.message });
  }
};
