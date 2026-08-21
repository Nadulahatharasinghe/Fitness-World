import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, default: 'Standard' }, // e.g. Basic, Pro, Elite
  description: { type: String, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true }, // months
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#FACC15' }, // for UI display
  maxSessions: { type: Number, default: null }, // null = unlimited
  includesTrainer: { type: Boolean, default: false },
  includesSupplements: { type: Boolean, default: false }
}, { timestamps: true });

const MembershipPlan = mongoose.model('MembershipPlan', membershipPlanSchema);
export default MembershipPlan;
