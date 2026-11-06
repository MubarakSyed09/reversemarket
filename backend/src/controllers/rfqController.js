import { RFQ } from '../models/RFQ.js';
import { Bid } from '../models/Bid.js';
import { User } from '../models/User.js';
import { inMemoryStore, isFallbackActive } from '../config/db.js';
import { extractRFQFromText } from '../services/aiService.js';

export const parsePromptWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Please provide a prompt' });

    const extracted = await extractRFQFromText(prompt);
    res.json({ success: true, extracted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRFQ = async (req, res) => {
  try {
    let { title, category, description, rawPrompt, prompt, quantity, unit, targetBudget, targetPrice, deliveryCity, location, deadlineDays, specs } = req.body;
    const buyerId = req.user?.id || req.body.buyerId || 'usr_buyer_1';
    const buyerName = req.body.buyerName || 'Verified Corporate Buyer';
    const company = req.body.company || 'Enterprise Procurement';

    const textToParse = prompt || rawPrompt;
    if (textToParse && (!title || !quantity || (!targetBudget && !targetPrice))) {
      try {
        const extracted = await extractRFQFromText(textToParse);
        if (extracted) {
          title = title || extracted.title;
          category = category || extracted.category;
          description = description || extracted.description;
          quantity = quantity || extracted.quantity;
          unit = unit || extracted.unit;
          targetBudget = targetBudget || targetPrice || extracted.targetBudget;
          deliveryCity = deliveryCity || location || extracted.deliveryCity;
          deadlineDays = deadlineDays || extracted.deadlineDays;
          specs = specs || extracted.specs;
        }
      } catch (err) {
        console.warn('AI prompt extraction fallback:', err.message);
      }
    }

    title = title || (textToParse ? textToParse.substring(0, 45) + '...' : 'Procurement Requirement');
    targetBudget = Number(targetBudget || targetPrice) || 60000;
    quantity = Number(quantity) || 1000;
    deliveryCity = deliveryCity || location || 'Mumbai';

    let rfqData;

    if (isFallbackActive()) {
      rfqData = {
        _id: 'rfq_' + Date.now(),
        buyerId,
        buyerName,
        company,
        title,
        category: category || 'Industrial',
        description: description || textToParse || '',
        rawPrompt: textToParse || '',
        quantity,
        unit: unit || 'units',
        targetBudget,
        targetPrice: targetBudget,
        deliveryCity,
        location: deliveryCity,
        deadlineDays: Number(deadlineDays) || 10,
        specs: specs || {},
        status: 'open',
        createdAt: new Date().toISOString()
      };
      inMemoryStore.rfqs.unshift(rfqData);
    } else {
      const created = await RFQ.create({
        _id: 'rfq_' + Date.now(),
        buyerId,
        title,
        category: category || 'Industrial',
        description: description || textToParse || '',
        rawPrompt: textToParse || '',
        quantity,
        unit: unit || 'units',
        targetBudget,
        targetPrice: targetBudget,
        deliveryCity,
        location: deliveryCity,
        deadlineDays: Number(deadlineDays) || 10,
        specs: specs || {},
        status: 'open'
      });
      rfqData = {
        ...created.toObject(),
        buyerName,
        company
      };
    }

    const payload = {
      _id: rfqData._id,
      id: rfqData._id,
      title: rfqData.title,
      category: rfqData.category,
      quantity: rfqData.quantity,
      unit: rfqData.unit,
      targetBudget: rfqData.targetBudget,
      targetPrice: rfqData.targetBudget,
      deliveryCity: rfqData.deliveryCity,
      location: rfqData.deliveryCity,
      buyerName,
      company,
      createdAt: rfqData.createdAt || new Date().toISOString()
    };

    if (req.app.get('io')) {
      req.app.get('io').emit('new_rfq', payload);
      req.app.get('io').emit('new_rfq_alert', payload);
    }

    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRFQs = async (req, res) => {
  try {
    const { category, city, status } = req.query;

    if (isFallbackActive()) {
      let filtered = [...inMemoryStore.rfqs];
      if (category && category !== 'All') filtered = filtered.filter(r => r.category === category);
      if (city) filtered = filtered.filter(r => r.deliveryCity.toLowerCase().includes(city.toLowerCase()));
      if (status) filtered = filtered.filter(r => r.status === status);

      const enriched = filtered.map(r => {
        const bidCount = inMemoryStore.bids.filter(b => b.rfqId === r._id || b.rfqId === r.id).length;
        const buyer = inMemoryStore.users.find(u => u._id === r.buyerId || u.id === r.buyerId);
        return { 
          ...r, 
          targetPrice: r.targetBudget || r.targetPrice,
          targetBudget: r.targetBudget || r.targetPrice,
          location: r.deliveryCity || r.location,
          deliveryDays: r.deadlineDays || r.deliveryDays || 10,
          bidCount, 
          buyerName: buyer ? buyer.name : 'Verified Corporate Buyer' 
        };
      });

      return res.json({ rfqs: enriched });
    }

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (city) filter.deliveryCity = new RegExp(city, 'i');
    if (status) filter.status = status;

    const rfqs = await RFQ.find(filter).sort({ createdAt: -1 });
    
    const enriched = await Promise.all(rfqs.map(async (r) => {
      const bidCount = await Bid.countDocuments({ rfqId: r._id || r.id });
      const buyer = await User.findById(r.buyerId);
      const obj = r.toObject();
      return {
        ...obj,
        targetPrice: obj.targetBudget || obj.targetPrice,
        targetBudget: obj.targetBudget || obj.targetPrice,
        location: obj.deliveryCity || obj.location,
        deliveryDays: obj.deadlineDays || obj.deliveryDays || 10,
        bidCount,
        buyerName: buyer?.name || 'Verified Corporate Buyer'
      };
    }));

    res.json({ rfqs: enriched });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRFQById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isFallbackActive()) {
      const rfq = inMemoryStore.rfqs.find(r => r._id === id || r.id === id);
      if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

      const buyer = inMemoryStore.users.find(u => u._id === rfq.buyerId || u.id === rfq.buyerId);
      const bids = inMemoryStore.bids.filter(b => b.rfqId === id);

      return res.json({
        rfq: {
          ...rfq,
          targetPrice: rfq.targetBudget || rfq.targetPrice,
          targetBudget: rfq.targetBudget || rfq.targetPrice,
          location: rfq.deliveryCity || rfq.location,
          deliveryDays: rfq.deadlineDays || rfq.deliveryDays || 10,
          buyerName: buyer?.name || 'Corporate Buyer',
          buyerLocation: buyer?.location || 'Vijayawada',
          buyerRating: buyer?.rating || 4.9,
          bidCount: bids.length
        }
      });
    }

    const rfq = await RFQ.findById(id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });

    const buyer = await User.findById(rfq.buyerId);
    const bidCount = await Bid.countDocuments({ rfqId: id });
    const obj = rfq.toObject();

    res.json({
      rfq: {
        ...obj,
        targetPrice: obj.targetBudget || obj.targetPrice,
        targetBudget: obj.targetBudget || obj.targetPrice,
        location: obj.deliveryCity || obj.location,
        deliveryDays: obj.deadlineDays || obj.deliveryDays || 10,
        buyerName: buyer?.name || 'Corporate Buyer',
        buyerLocation: buyer?.location || 'Vijayawada',
        buyerRating: buyer?.rating || 4.9,
        bidCount
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
