import { Order } from '../models/Order.js';
import { RFQ } from '../models/RFQ.js';
import { Bid } from '../models/Bid.js';
import { User } from '../models/User.js';
import { inMemoryStore, isFallbackActive } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const { rfqId, bidId, supplierId, totalAmount } = req.body;
    const buyerId = req.user?.id || req.body.buyerId || 'usr_buyer_1';

    const finalAmount = Number(totalAmount) || 20000;
    const advanceAmount = Math.round(finalAmount * 0.40);
    const balanceAmount = finalAmount - advanceAmount;

    if (isFallbackActive()) {
      const order = {
        _id: 'ord_' + Date.now(),
        rfqId: rfqId || 'rfq_default',
        buyerId,
        supplierId: supplierId || 'usr_supplier_1',
        winningBidId: bidId || 'bid_' + Date.now(),
        totalAmount: finalAmount,
        advanceAmount,
        finalAmount: balanceAmount,
        advancePaid: false,
        finalPaid: false,
        status: 'awaiting_advance',
        milestones: [
          { step: '40% Advance Payment & Raw Material Escrow', date: new Date().toISOString(), completed: false },
          { step: 'Batch Manufacturing & Quality Inspection', date: new Date().toISOString(), completed: false },
          { step: 'Logistics Dispatch & Waybill Generation', date: new Date().toISOString(), completed: false },
          { step: 'Delivery Reach-out & 60% Final Settlement', date: new Date().toISOString(), completed: false }
        ],
        createdAt: new Date().toISOString()
      };
      inMemoryStore.orders.push(order);
      return res.status(201).json(order);
    }

    if (bidId) {
      await Bid.findByIdAndUpdate(bidId, { status: 'accepted' });
    }
    if (rfqId) {
      await RFQ.findByIdAndUpdate(rfqId, { status: 'awarded' });
    }

    const order = await Order.create({
      _id: 'ord_' + Date.now(),
      rfqId: rfqId || 'rfq_default',
      buyerId,
      supplierId: supplierId || 'usr_supplier_1',
      winningBidId: bidId || 'bid_' + Date.now(),
      totalAmount: finalAmount,
      advanceAmount,
      finalAmount: balanceAmount,
      advancePaid: false,
      finalPaid: false,
      status: 'awaiting_advance',
      milestones: [
        { step: '40% Advance Payment & Raw Material Escrow', completed: false },
        { step: 'Batch Manufacturing & Quality Inspection', completed: false },
        { step: 'Logistics Dispatch & Waybill Generation', completed: false },
        { step: 'Delivery Reach-out & 60% Final Settlement', completed: false }
      ]
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (isFallbackActive()) {
      const enriched = inMemoryStore.orders.map(o => {
        const rfq = inMemoryStore.rfqs.find(r => r._id === o.rfqId || r.id === o.rfqId);
        const sup = inMemoryStore.users.find(u => u._id === o.supplierId || u.id === o.supplierId);
        const buyer = inMemoryStore.users.find(u => u._id === o.buyerId || u.id === o.buyerId);

        return {
          ...o,
          rfqTitle: rfq ? rfq.title : 'Procurement Order',
          category: rfq ? rfq.category : 'General',
          quantity: rfq ? rfq.quantity : 500,
          unit: rfq ? rfq.unit : 'units',
          deliveryCity: rfq ? rfq.deliveryCity : 'Vijayawada',
          supplierName: sup ? sup.name : 'Apex Vendor',
          buyerName: buyer ? buyer.name : 'Prime Buyer'
        };
      });

      return res.json({ orders: enriched });
    }

    const orders = await Order.find({}).sort({ createdAt: -1 });

    const enriched = await Promise.all(orders.map(async (o) => {
      const rfq = await RFQ.findById(o.rfqId);
      const sup = await User.findById(o.supplierId);
      const buyer = await User.findById(o.buyerId);
      return {
        ...o.toObject(),
        rfqTitle: rfq?.title || 'Procurement Order',
        category: rfq?.category || 'General',
        quantity: rfq?.quantity || 500,
        unit: rfq?.unit || 'units',
        deliveryCity: rfq?.deliveryCity || 'Vijayawada',
        supplierName: sup?.name || 'Apex Vendor',
        buyerName: buyer?.name || 'Prime Buyer'
      };
    }));

    res.json({ orders: enriched });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const payAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const { utr } = req.body;

    if (isFallbackActive()) {
      const order = inMemoryStore.orders.find(o => o._id === id || o.id === id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      order.advancePaid = true;
      order.advanceUtr = utr || 'UPI-' + Math.floor(100000000000 + Math.random() * 900000000000);
      order.status = 'in_production';
      if (order.milestones && order.milestones[0]) order.milestones[0].completed = true;

      return res.json({ success: true, order });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.advancePaid = true;
    order.advanceUtr = utr || 'UPI-' + Math.floor(100000000000 + Math.random() * 900000000000);
    order.status = 'in_production';
    if (order.milestones && order.milestones[0]) order.milestones[0].completed = true;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const payFinal = async (req, res) => {
  try {
    const { id } = req.params;
    const { utr } = req.body;

    if (isFallbackActive()) {
      const order = inMemoryStore.orders.find(o => o._id === id || o.id === id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      order.finalPaid = true;
      order.finalUtr = utr || 'UPI-' + Math.floor(100000000000 + Math.random() * 900000000000);
      order.status = 'delivered';
      if (order.milestones) {
        order.milestones.forEach(m => m.completed = true);
      }

      return res.json({ success: true, order });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.finalPaid = true;
    order.finalUtr = utr || 'UPI-' + Math.floor(100000000000 + Math.random() * 900000000000);
    order.status = 'delivered';
    if (order.milestones) {
      order.milestones.forEach(m => m.completed = true);
    }
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['awaiting_advance', 'in_production', 'quality_inspection', 'dispatched', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (isFallbackActive()) {
      const order = inMemoryStore.orders.find(o => o._id === id || o.id === id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      order.status = status;
      const stepIndex = validStatuses.indexOf(status);
      if (order.milestones && order.milestones.length > 0) {
        order.milestones.forEach((m, idx) => {
          if (idx <= stepIndex) m.completed = true;
        });
      }

      return res.json({ success: true, order });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    const stepIndex = validStatuses.indexOf(status);
    if (order.milestones && order.milestones.length > 0) {
      order.milestones.forEach((m, idx) => {
        if (idx <= stepIndex) m.completed = true;
      });
    }
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
