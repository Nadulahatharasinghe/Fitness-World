import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WorkoutPlan from '../models/Customer/WorkoutPlan.js';
import Product from '../models/Customer/Product.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const workoutPlans = [
  {
    name: "Cardio Monthly",
    price: 2500,
    image: "/images/cardiomonth.webp",
    category: "Cardio",
    duration: "1 Month",
    sessions: "Unlimited Cardio Access",
    benefits: ["Treadmill & Cycling", "Fat Burning Program", "Beginner Friendly"],
  },
  {
    name: "Cardio Annual",
    price: 20000,
    image: "/images/crdiooanual.webp",
    category: "Cardio",
    duration: "12 Months",
    sessions: "Unlimited Cardio Access",
    benefits: ["Full Year Access", "Free Body Assessment", "Best Value Plan"],
  },
  {
    name: "Fitness Monthly",
    price: 1500,
    image: "/images/fitnessmonthly.jpg",
    category: "Fitness",
    duration: "1 Month",
    sessions: "Strength & Fitness Training",
    benefits: ["Weight Training", "Muscle Building", "Flexible Schedule"],
  },
  {
    name: "Fitness Annual",
    price: 10000,
    image: "/images/fitnessanual.jpg",
    category: "Fitness",
    duration: "12 Months",
    sessions: "Full Gym Access",
    benefits: ["Unlimited Training", "Diet Plan Included", "Trainer Guidance"],
  },
  {
    name: "Personal Training Monthly",
    price: 5000,
    image: "/images/personaltrainee.jpg",
    category: "Personal",
    duration: "1 Month",
    sessions: "One-on-One Training",
    benefits: ["Personal Trainer", "Custom Workout Plan", "Fast Results"],
  },
];

const products = [
  { name: "Fish Oil", price: 3200, image: "/images/fishoil.jpg", category: "Supplements" },
  { name: "Whey Protein", price: 5500, image: "/images/wayproteen.webp", category: "Supplements" },
  { name: "Supplements", price: 2800, image: "/images/supliments.png", category: "Supplements" },
  { name: "Iron Capsules", price: 4200, image: "/images/ironcap.webp", category: "Supplements" },
];

const seedData = async () => {
  try {
    await WorkoutPlan.deleteMany();
    await Product.deleteMany();

    await WorkoutPlan.insertMany(workoutPlans);
    await Product.insertMany(products);

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();