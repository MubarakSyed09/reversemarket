import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  _id: { type: String },
  rfqId: { type: String, required: true },
  supplierId: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  specComplianceScore: { type: Number, default: 95 },
  warrantyMonths: { type: Number, default: 6 },
  notes: { type: String, default: '' },
  topsisScore: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  isAnomaly: { type: Boolean, default: false },
  anomalyReason: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true, _id: false });

export const Bid = mongoose.model('Bid', bidSchema);
