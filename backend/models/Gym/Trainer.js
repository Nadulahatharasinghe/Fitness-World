import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  specialization: {
    type: String,
    required: true,
    enum: ['Strength Training', 'Cardio', 'Yoga', 'CrossFit', 'Boxing', 'Swimming', 'Pilates', 'Nutrition', 'General Fitness', 'Other'],
    default: 'General Fitness'
  },
  experience: { type: Number, default: 0 }, // years
  bio: { type: String, maxlength: 500 },
  avatar: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  certifications: [{ type: String }],
  schedule: [{ day: String, startTime: String, endTime: String }],
  isActive: { type: Boolean, default: true },
  monthlyFee: { type: Number, default: 0 }
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', trainerSchema);
export default Trainer;
