import MembershipPurchase from '../../models/Gym/MembershipPurchase.js';
import MembershipPlan from '../../models/Gym/MembershipPlan.js';
import User from '../../models/Admin/User.js';
import { sendEmailNotification } from '../../utils/notifications.js';

// User apply for membership
export const applyForMembership = async (req, res) => {
  try {
    const { planId, fullName, email, phone, startDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Payment slip is required.' });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Membership plan not found.' });
    }

    // Normalize path for web (replace backslashes with slashes)
    const paymentSlipPath = req.file.path.replace(/\\/g, '/');

    // Calculate end date based on plan duration (months)
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + plan.duration);

    const purchase = new MembershipPurchase({
      user: req.userId,
      plan: planId,
      fullName,
      email,
      phone,
      startDate: start,
      endDate: end,
      amount: plan.price,
      paymentSlip: paymentSlipPath,
      paymentStatus: 'pending',
      membershipStatus: 'inactive'
    });

    await purchase.save();

    res.status(201).json({
      message: 'Membership application submitted successfully. Pending admin verification.',
      purchase
    });
  } catch (error) {
    console.error('Membership apply error:', error);
    res.status(500).json({ message: 'Error applying for membership.', error: error.message });
  }
};

// User get my memberships
export const getMyMemberships = async (req, res) => {
  try {
    const purchases = await MembershipPurchase.find({ user: req.userId })
      .populate('plan')
      .sort({ createdAt: -1 });
    res.json({ purchases });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching membership history.', error: error.message });
  }
};

// Admin get all membership purchases
export const adminGetAllMemberships = async (req, res) => {
  try {
    const purchases = await MembershipPurchase.find({})
      .populate('user', 'username email firstName lastName')
      .populate('plan')
      .sort({ createdAt: -1 });
    res.json({ purchases });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching memberships.', error: error.message });
  }
};

// Admin get membership by id
export const adminGetMembershipById = async (req, res) => {
  try {
    const purchase = await MembershipPurchase.findById(req.params.id)
      .populate('user', 'username email firstName lastName')
      .populate('plan');
    if (!purchase) {
      return res.status(404).json({ message: 'Membership application not found.' });
    }
    res.json({ purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching membership.', error: error.message });
  }
};

// Admin approve membership
export const adminApproveMembership = async (req, res) => {
  try {
    const purchase = await MembershipPurchase.findById(req.params.id).populate('plan');
    if (!purchase) {
      return res.status(404).json({ message: 'Membership application not found.' });
    }

    purchase.paymentStatus = 'approved';
    purchase.membershipStatus = 'active';
    purchase.approvedAt = new Date();
    if (req.body.adminMessage) {
      purchase.adminMessage = req.body.adminMessage;
    }
    
    await purchase.save();

    // Trigger email notification
    await sendEmailNotification({
      to: purchase.email,
      subject: 'Fitness World - Membership Approved! 🏋️',
      text: `Hello ${purchase.fullName},\n\nYour payment for the "${purchase.plan.name}" membership has been approved.\nAmount: Rs. ${purchase.amount.toLocaleString()}\nStatus: Active\n\nThank you for choosing Fitness World! Let's get fit.`
    });

    res.json({ message: 'Membership approved successfully.', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error approving membership.', error: error.message });
  }
};

// Admin reject membership
export const adminRejectMembership = async (req, res) => {
  try {
    const { adminMessage } = req.body;
    const purchase = await MembershipPurchase.findById(req.params.id).populate('plan');
    if (!purchase) {
      return res.status(404).json({ message: 'Membership application not found.' });
    }

    purchase.paymentStatus = 'rejected';
    purchase.membershipStatus = 'inactive';
    purchase.rejectedAt = new Date();
    purchase.adminMessage = adminMessage || 'Payment slip could not be verified.';
    
    await purchase.save();

    // Trigger email notification
    await sendEmailNotification({
      to: purchase.email,
      subject: 'Fitness World - Membership Payment Slip Rejected',
      text: `Hello ${purchase.fullName},\n\nWe could not verify your payment slip for the "${purchase.plan.name}" membership.\nReason: ${purchase.adminMessage}\n\nPlease check your receipt and submit again or contact Fitness World (+94711701408).\n\nBest regards,\nFitness World Admin`
    });

    res.json({ message: 'Membership application rejected.', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting membership.', error: error.message });
  }
};

// Admin update message
export const adminUpdateMessage = async (req, res) => {
  try {
    const { adminMessage } = req.body;
    const purchase = await MembershipPurchase.findByIdAndUpdate(
      req.params.id,
      { adminMessage },
      { new: true }
    );
    if (!purchase) {
      return res.status(404).json({ message: 'Membership application not found.' });
    }
    res.json({ message: 'Admin message updated.', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin message.', error: error.message });
  }
};
