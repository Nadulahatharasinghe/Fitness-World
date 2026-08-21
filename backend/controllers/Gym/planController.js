import MembershipPlan from '../../models/Gym/MembershipPlan.js';

export const getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans.', error: error.message });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    res.json({ plan });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan.', error: error.message });
  }
};

export const createPlan = async (req, res) => {
  try {
    const plan = new MembershipPlan(req.body);
    await plan.save();
    res.status(201).json({ message: 'Membership plan created.', plan });
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan.', error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    res.json({ message: 'Plan updated.', plan });
  } catch (error) {
    res.status(500).json({ message: 'Error updating plan.', error: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found.' });
    res.json({ message: 'Plan deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan.', error: error.message });
  }
};
