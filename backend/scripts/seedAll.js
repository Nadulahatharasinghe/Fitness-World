import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import MembershipPlan from '../models/Gym/MembershipPlan.js';
import Trainer from '../models/Gym/Trainer.js';
import StoreProduct from '../models/Gym/StoreProduct.js';

dotenv.config();

const plans = [
  {
    name: 'Basic Monthly',
    type: 'Basic',
    price: 3500,
    duration: 1,
    description: 'Perfect for beginners who want access to premium gym equipment.',
    features: ['Full Gym Access', 'Locker Room & Shower', 'Cardio & Strength Zones', '1 Fitness Assessment'],
    isPopular: false,
    color: '#A1A1AA'
  },
  {
    name: 'Pro Fitness',
    type: 'Pro',
    price: 7500,
    duration: 3,
    description: 'Our most popular plan, designed for intermediate fitness enthusiasts.',
    features: ['Everything in Basic', '2 Personal Training Sessions', 'Access to all Group Classes', 'Basic Nutrition Guidance', 'Progress Tracking Dashboard'],
    isPopular: true,
    color: '#FACC15'
  },
  {
    name: 'Elite Transformation',
    type: 'Elite',
    price: 14000,
    duration: 6,
    description: 'An all-inclusive premium package for complete lifestyle transformations.',
    features: ['Everything in Pro', 'Unlimited Personal Training', 'Customized Workout & Diet Plans', 'Detailed Body Analytics', '10% Discount at Gym Store', 'Dedicated Fitness Coach'],
    isPopular: false,
    color: '#F59E0B'
  }
];

const trainers = [
  {
    name: 'Ashan Mendis',
    specialization: 'Strength Training',
    experience: 8,
    bio: 'Former national powerlifter specializing in strength, powerlifting coaching, and form correction.',
    rating: 4.9
  },
  {
    name: 'Nisha Rajapaksa',
    specialization: 'Yoga',
    experience: 6,
    bio: 'Certified yoga instructor focusing on flexibility, post-workout recovery, and mental wellness.',
    rating: 4.8
  },
  {
    name: 'Tharaka Wijesiri',
    specialization: 'CrossFit',
    experience: 5,
    bio: 'CrossFit Level 2 trainer specializing in functional fitness, high-intensity workouts, and agility.',
    rating: 4.7
  },
  {
    name: 'Ramesh Silva',
    specialization: 'Strength Training',
    experience: 10,
    bio: 'Experienced bodybuilding coach with 10+ years helping athletes build muscle and prep for competitions.',
    rating: 4.9
  }
];

const products = [
  {
    name: 'Whey Protein Isolate',
    category: 'Protein',
    description: 'Premium 100% Whey Protein Isolate containing 24g of protein per serving for muscle repair, recovery, and lean mass growth.',
    price: 18500,
    stock: 15,
    image: '',
    benefits: ['Builds lean muscle mass', 'Speeds up muscle recovery', '24g protein per serving', 'Easy to mix and digest']
  },
  {
    name: 'Triple Strength Fish Oil',
    category: 'Fish oil',
    description: 'Concentrated Omega-3 Fish Oil capsules rich in EPA and DHA to support heart, brain, and joint mobility.',
    price: 4500,
    stock: 30,
    image: '',
    benefits: ['Supports joint health', 'Improves cardiovascular function', 'Rich in Omega-3 EPA/DHA', 'Supports brain health']
  },
  {
    name: 'Micronized Creatine Monohydrate',
    category: 'Creatine',
    description: '100% pure, unflavored micronized creatine to boost cellular energy, muscle strength, and athletic performance.',
    price: 6800,
    stock: 25,
    image: '',
    benefits: ['Increases strength & power', 'Enhances high-intensity exercise', 'Improves cell hydration', 'Unflavored for easy mixing']
  },
  {
    name: 'Pre-Workout Energy Formula',
    category: 'Pre-workout',
    description: 'High-energy pre-workout powder with Beta-Alanine, L-Arginine, and Caffeine to fuel intense focus, muscle pumps, and training capacity.',
    price: 9200,
    stock: 20,
    image: '',
    benefits: ['Explosive energy boost', 'Enhanced muscle pump & vascularity', 'Improves mental focus', 'Includes Beta-Alanine and Caffeine']
  },
  {
    name: 'Heavy Duty Weightlifting Gloves',
    category: 'Gym gloves',
    description: 'Padded leather weightlifting gloves with reinforced wrist wraps for superior grip and palm protection.',
    price: 2200,
    stock: 50,
    image: '',
    benefits: ['Protects palms from calluses', 'Enhanced grip with silicone padding', 'Breathable mesh material', 'Adjustable wrist strap']
  },
  {
    name: 'Leak-Proof Supplement Shaker',
    category: 'Shakers',
    description: '700ml BPA-free shaker cup featuring a wire whisk ball, carrying loop, and tight-seal flip lid.',
    price: 1500,
    stock: 100,
    image: '',
    benefits: ['Leak-proof flip cap', 'Includes steel mixing ball', 'BPA-free plastic material', '700ml capacity']
  }
];

const seedAll = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting DB seeding...');

    // Clear old data
    await MembershipPlan.deleteMany({});
    console.log('🗑️ MembershipPlans cleared.');
    
    await Trainer.deleteMany({});
    console.log('🗑️ Trainers cleared.');
    
    await StoreProduct.deleteMany({});
    console.log('🗑️ StoreProducts cleared.');

    // Seed new data
    const seededPlans = await MembershipPlan.insertMany(plans);
    console.log(`✅ Seeded ${seededPlans.length} Membership Plans.`);

    const seededTrainers = await Trainer.insertMany(trainers);
    console.log(`✅ Seeded ${seededTrainers.length} Trainers.`);

    const seededProducts = await StoreProduct.insertMany(products);
    console.log(`✅ Seeded ${seededProducts.length} Store Products.`);

    console.log('🎉 Seeding successfully completed!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAll();
