import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  _id: { type: String },
  rfqId: { type: String, required: true },
  buyerId: { type: String, required: true },
  supplierId: { type: String, required: true },
  winningBidId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, required: true }, // 40% advance
  finalAmount: { type: Number, required: true },   // 60% final
  advancePaid: { type: Boolean, default: false },
  finalPaid: { type: Boolean, default: false },
  advanceUtr: { type: String, default: '' },
  finalUtr: { type: String, default: '' },
  trackingNumber: { type: String, default: () => 'TRK-' + Math.random().toString(36).substring(2, 9).toUpperCase() },
  status: {
    type: String,
    enum: ['awaiting_advance', 'in_production', 'quality_inspection', 'dispatched', 'delivered'],
    default: 'awaiting_advance'
  },
  milestones: [{
    step: String,
    date: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true, _id: false });

export const Order = mongoose.model('Order', orderSchema);
