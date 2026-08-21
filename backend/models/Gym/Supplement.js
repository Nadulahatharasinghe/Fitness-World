import mongoose from 'mongoose';

const supplementSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 500 },
  category: {
    type: String,
    enum: ['Protein', 'Creatine', 'Pre-Workout', 'BCAA', 'Vitamins', 'Weight Gainer', 'Fat Burner', 'Other'],
    default: 'Protein'
  },
  brand: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
  weight: { type: String }, // e.g. "1kg", "2.5lbs"
  flavors: [{ type: String }],
  inStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Supplement = mongoose.model('Supplement', supplementSchema);
export default Supplement;
