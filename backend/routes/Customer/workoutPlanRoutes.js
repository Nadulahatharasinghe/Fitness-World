import express from "express";
import {
    getAllWorkoutPlans,
    addWorkoutPlan,
    getWorkoutPlanById,
    updateWorkoutPlan,
    deleteWorkoutPlan,
} from "../../controllers/Customer/WorkoutPlanController.js";

const router = express.Router();

// @route   GET /api/workout-plans
// @desc    Get all workout plans
router.get("/", getAllWorkoutPlans);

// @route   POST /api/workout-plans
// @desc    Add a new workout plan
router.post("/", addWorkoutPlan);

// @route   GET /api/workout-plans/:id
// @desc    Get a workout plan by ID
router.get("/:id", getWorkoutPlanById);

// @route   PUT /api/workout-plans/:id
// @desc    Update a workout plan
router.put("/:id", updateWorkoutPlan);

// @route   DELETE /api/workout-plans/:id
// @desc    Delete a workout plan
router.delete("/:id", deleteWorkoutPlan);

export default router;