import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', default: null },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', default: null },
  sessionDate: { type: Date, required: true },
  sessionTime: { type: String, required: true }, // e.g. "09:00"
  duration: { type: Number, default: 60 }, // minutes
  type: {
    type: String,
    enum: ['Personal Training', 'Group Class', 'Yoga', 'CrossFit', 'Cardio', 'Strength', 'Other'],
    default: 'Personal Training'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: { type: String, maxlength: 300 },
  price: { type: Number, default: 0 }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
