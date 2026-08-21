import mongoose from 'mongoose';

const storeProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Protein', 'Creatine', 'Pre-workout', 'Fish oil', 'Gym gloves', 'Belts', 'Shakers', 'Gym materials', 'Accessories', 'Other']
  },
  description: {
    type: String,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  benefits: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const StoreProduct = mongoose.model('StoreProduct', storeProductSchema);
export default StoreProduct;
