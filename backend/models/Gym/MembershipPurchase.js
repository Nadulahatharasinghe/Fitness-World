import mongoose from 'mongoose';

const membershipPurchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipPlan',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    default: 'Bank Transfer'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentSlip: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  membershipStatus: {
    type: String,
    enum: ['inactive', 'active', 'expired'],
    default: 'inactive'
  },
  adminMessage: {
    type: String,
    default: ''
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const MembershipPurchase = mongoose.model('MembershipPurchase', membershipPurchaseSchema);
export default MembershipPurchase;
