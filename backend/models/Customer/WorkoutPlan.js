import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    sessions: {
        type: String,
        required: true,
    },
    benefits: [{
        type: String,
        required: true,
    }]
}, {
    timestamps: true
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;