import mongoose from 'mongoose';

const rfqSchema = new mongoose.Schema({
  _id: { type: String },
  buyerId: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  rawPrompt: { type: String, default: '' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'units' },
  targetBudget: { type: Number, default: 0 },
  deliveryCity: { type: String, required: true },
  deadlineDays: { type: Number, default: 10 },
  specs: { type: Map, of: String, default: {} },
  status: {
    type: String,
    enum: ['open', 'bidding', 'awarded', 'fulfilled', 'cancelled'],
    default: 'open'
  }
}, { timestamps: true, _id: false });

export const RFQ = mongoose.model('RFQ', rfqSchema);
