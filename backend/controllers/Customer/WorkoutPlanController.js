import WorkoutPlan from "../../models/Customer/WorkoutPlan.js";

// Get all workout plans
export const getAllWorkoutPlans = async (req, res) => {
  try {
    const workoutPlans = await WorkoutPlan.find();
    if (!workoutPlans || workoutPlans.length === 0) {
      return res.status(404).json({ message: "No workout plans found" });
    }
    return res.status(200).json({ workoutPlans });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Add new workout plan
export const addWorkoutPlan = async (req, res) => {
  const { name, price, image, category, duration, sessions, benefits } = req.body;
  try {
    const workoutPlan = new WorkoutPlan({ name, price, image, category, duration, sessions, benefits });
    await workoutPlan.save();
    if (!workoutPlan) {
      return res.status(404).json({ message: "Unable to add workout plan" });
    }
    return res.status(200).json({ workoutPlan });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get workout plan by ID
export const getWorkoutPlanById = async (req, res) => {
  const id = req.params.id;
  try {
    const workoutPlan = await WorkoutPlan.findById(id);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Workout plan not found" });
    }
    return res.status(200).json({ workoutPlan });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update workout plan
export const updateWorkoutPlan = async (req, res) => {
  const id = req.params.id;
  const { name, price, image, category, duration, sessions, benefits } = req.body;
  try {
    const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
      id,
      { name, price, image, category, duration, sessions, benefits },
      { new: true }
    );
    if (!workoutPlan) {
      return res.status(404).json({ message: "Unable to update workout plan" });
    }
    return res.status(200).json({ workoutPlan });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete workout plan
export const deleteWorkoutPlan = async (req, res) => {
  const id = req.params.id;
  try {
    const workoutPlan = await WorkoutPlan.findByIdAndDelete(id);
    if (!workoutPlan) {
      return res.status(404).json({ message: "Unable to delete workout plan" });
    }
    return res.status(200).json({ workoutPlan });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};