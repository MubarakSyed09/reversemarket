import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '+91 98765 43210' },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'supplier', 'admin'], default: 'buyer' },
  company: { type: String, default: '' },
  location: { type: String, default: 'Vijayawada, India' },
  rating: { type: Number, default: 4.8 },
  completedOrders: { type: Number, default: 0 },
  verified: { type: Boolean, default: true }
}, { timestamps: true, _id: false });

export const User = mongoose.model('User', userSchema);
