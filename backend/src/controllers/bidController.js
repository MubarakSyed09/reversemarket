import { Bid } from '../models/Bid.js';
import { RFQ } from '../models/RFQ.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { inMemoryStore, isFallbackActive } from '../config/db.js';
import { calculateTOPSIS } from '../services/topsisService.js';

export const placeBid = async (req, res) => {
  try {
    const { rfqId, deliveryDays, specComplianceScore, warrantyMonths, notes } = req.body;
    const supplierId = req.user?.id || req.body.supplierId || 'usr_supplier_1';

    const rfq = isFallbackActive()
      ? inMemoryStore.rfqs.find(r => r._id === rfqId || r.id === rfqId)
      : await RFQ.findById(rfqId);

    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    const quantity = Number(rfq.quantity) || 1;
    let totalPrice = Number(req.body.totalPrice || req.body.price);
    let unitPrice = Number(req.body.unitPrice);

    if (totalPrice && !unitPrice) {
      unitPrice = Math.max(1, Math.round(totalPrice / quantity));
    } else if (!totalPrice && unitPrice) {
      totalPrice = Math.round(unitPrice * quantity);
    } else if (!totalPrice && !unitPrice) {
      totalPrice = 10000;
      unitPrice = Math.max(1, Math.round(10000 / quantity));
    }

    const supplierName = req.body.supplierName || 'Verified Supplier';

    if (isFallbackActive()) {
      const supplier = inMemoryStore.users.find(u => u._id === supplierId || u.id === supplierId) || {
        name: supplierName,
        rating: 4.9
      };

      const newBid = {
        _id: 'bid_' + Date.now(),
        rfqId,
        supplierId: supplier._id || supplierId,
        supplierName: supplier.name || supplierName,
        supplierRating: supplier.rating || 4.8,
        unitPrice,
        totalPrice,
        price: totalPrice,
        deliveryDays: Number(deliveryDays) || 7,
        specComplianceScore: Number(specComplianceScore) || 95,
        warrantyMonths: Number(warrantyMonths) || 12,
        notes: notes || '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      inMemoryStore.bids.push(newBid);

      const rfqBids = inMemoryStore.bids.filter(b => b.rfqId === rfqId);
      const ranked = calculateTOPSIS(rfqBids).map(b => ({
        ...b,
        price: b.totalPrice || b.price,
        totalPrice: b.totalPrice || b.price
      }));

      if (req.app.get('io')) {
        req.app.get('io').to(`rfq_${rfqId}`).emit('new_bid_placed', {
          bids: ranked,
          latestBid: newBid
        });
        req.app.get('io').emit('bid_update', newBid);
      }

      return res.status(201).json({ bid: newBid, rankedBids: ranked });
    }

    const supplier = await User.findById(supplierId);
    const resolvedName = supplier?.name || supplierName;
    const resolvedRating = supplier?.rating || 4.8;

    const bid = await Bid.create({
      _id: 'bid_' + Date.now(),
      rfqId,
      supplierId,
      unitPrice,
      totalPrice,
      deliveryDays: Number(deliveryDays) || 7,
      specComplianceScore: Number(specComplianceScore) || 95,
      warrantyMonths: Number(warrantyMonths) || 12,
      notes: notes || ''
    });

    const allBids = await Bid.find({ rfqId });
    const plainBids = await Promise.all(allBids.map(async (b) => {
      const sup = await User.findById(b.supplierId);
      return {
        ...b.toObject(),
        price: b.totalPrice,
        totalPrice: b.totalPrice,
        supplierName: sup?.name || resolvedName,
        supplierRating: sup?.rating || resolvedRating
      };
    }));

    const ranked = calculateTOPSIS(plainBids).map(b => ({
      ...b,
      price: b.totalPrice || b.price,
      totalPrice: b.totalPrice || b.price
    }));

    for (const r of ranked) {
      if (r._id) {
        await Bid.findByIdAndUpdate(r._id, {
          topsisScore: r.topsisScore,
          rank: r.rank,
          isAnomaly: r.isAnomaly,
          anomalyReason: r.anomalyReason
        });
      }
    }

    const bidPayload = {
      ...bid.toObject(),
      price: bid.totalPrice,
      totalPrice: bid.totalPrice,
      supplierName: resolvedName,
      supplierRating: resolvedRating
    };

    if (req.app.get('io')) {
      req.app.get('io').to(`rfq_${rfqId}`).emit('new_bid_placed', {
        bids: ranked,
        latestBid: bidPayload
      });
      req.app.get('io').emit('bid_update', bidPayload);
    }

    res.status(201).json({ bid: bidPayload, rankedBids: ranked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBidsForRFQ = async (req, res) => {
  try {
    const { rfqId } = req.params;

    if (isFallbackActive()) {
      const rawBids = inMemoryStore.bids.filter(b => b.rfqId === rfqId);
      const enriched = rawBids.map(b => {
        const sup = inMemoryStore.users.find(u => u._id === b.supplierId || u.id === b.supplierId);
        return {
          ...b,
          price: b.totalPrice || b.price,
          totalPrice: b.totalPrice || b.price,
          supplierName: sup ? sup.name : b.supplierName || 'Verified Supplier',
          supplierRating: sup ? sup.rating : b.supplierRating || 4.5,
          supplierCompany: sup ? sup.company : 'ProcureX Partner'
        };
      });

      const ranked = calculateTOPSIS(enriched).map(b => ({
        ...b,
        price: b.totalPrice || b.price,
        totalPrice: b.totalPrice || b.price
      }));
      return res.json({ bids: ranked });
    }

    const bids = await Bid.find({ rfqId });
    const plainBids = await Promise.all(bids.map(async (b) => {
      const sup = await User.findById(b.supplierId);
      return {
        ...b.toObject(),
        price: b.totalPrice,
        totalPrice: b.totalPrice,
        supplierName: sup?.name || 'Verified Supplier',
        supplierRating: sup?.rating || 4.5,
        supplierCompany: sup?.company || 'Certified Vendor'
      };
    }));

    const ranked = calculateTOPSIS(plainBids).map(b => ({
      ...b,
      price: b.totalPrice || b.price,
      totalPrice: b.totalPrice || b.price
    }));
    res.json({ bids: ranked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.body;
    const buyerId = req.user?.id || req.body.buyerId;

    if (isFallbackActive()) {
      const bid = inMemoryStore.bids.find(b => b._id === bidId || b.id === bidId);
      if (!bid) return res.status(404).json({ error: 'Bid not found' });

      bid.status = 'accepted';
      const rfq = inMemoryStore.rfqs.find(r => r._id === bid.rfqId || r.id === bid.rfqId);
      if (rfq) rfq.status = 'awarded';

      const totalAmount = bid.totalPrice;
      const advanceAmount = Math.round(totalAmount * 0.40);
      const finalAmount = totalAmount - advanceAmount;

      const order = {
        _id: 'ord_' + Date.now(),
        rfqId: bid.rfqId,
        buyerId: rfq?.buyerId || buyerId,
        supplierId: bid.supplierId,
        winningBidId: bid._id,
        totalAmount,
        advanceAmount,
        finalAmount,
        advancePaid: false,
        finalPaid: false,
        trackingNumber: 'TRK-' + Math.floor(100000 + Math.random() * 900000),
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

      return res.json({ success: true, order });
    }

    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ error: 'Bid not found' });

    bid.status = 'accepted';
    await bid.save();

    const rfq = await RFQ.findByIdAndUpdate(bid.rfqId, { status: 'awarded' });

    const totalAmount = bid.totalPrice;
    const advanceAmount = Math.round(totalAmount * 0.40);
    const finalAmount = totalAmount - advanceAmount;

    const order = await Order.create({
      _id: 'ord_' + Date.now(),
      rfqId: bid.rfqId,
      buyerId: req.user?.id || rfq?.buyerId || 'usr_buyer_1',
      supplierId: bid.supplierId || 'usr_supplier_1',
      winningBidId: bid._id,
      totalAmount,
      advanceAmount,
      finalAmount,
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

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
