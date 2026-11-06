import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { RFQ } from './src/models/RFQ.js';
import { Bid } from './src/models/Bid.js';
import { Order } from './src/models/Order.js';
import { calculateTOPSIS } from './src/services/topsisService.js';
import dotenv from 'dotenv';

dotenv.config();

const runReseed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reversemarket';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB. Resetting collections with meaningful B2B procurement data...');

  await User.deleteMany({});
  await RFQ.deleteMany({});
  await Bid.deleteMany({});
  await Order.deleteMany({});

  const hash = bcrypt.hashSync('password123', 8);

  const users = [
    {
      _id: 'usr_buyer_1',
      name: 'Rahul Sen (Apex Global Procurement)',
      email: 'buyer_rahul',
      phone: '+91 98480 12345',
      password: hash,
      role: 'buyer',
      company: 'Apex Global Enterprises Pvt Ltd',
      location: 'Hyderabad, India',
      rating: 4.9,
      completedOrders: 28,
      verified: true
    },
    {
      _id: 'usr_buyer_2',
      name: 'Ramesh Varma (GreenBite Organics)',
      email: 'buyer2',
      phone: '+91 94401 54321',
      password: hash,
      role: 'buyer',
      company: 'GreenBite Organics & Retail Ltd',
      location: 'Bengaluru, India',
      rating: 4.8,
      completedOrders: 19,
      verified: true
    },
    {
      _id: 'usr_seller_1',
      name: 'Sunil Mehta (Sri Krishna Print & Pack)',
      email: 'seller_sunil',
      phone: '+91 98660 77889',
      password: hash,
      role: 'seller',
      company: 'Sri Krishna Industrial Works & Printing',
      location: 'Hyderabad, India',
      rating: 4.9,
      completedOrders: 142,
      verified: true
    },
    {
      _id: 'usr_supplier_2',
      name: 'Deccan Paper Mills & Binders',
      email: 'seller2',
      phone: '+91 98855 33221',
      password: hash,
      role: 'supplier',
      company: 'Deccan Mills Group India',
      location: 'Secunderabad, India',
      rating: 4.6,
      completedOrders: 98,
      verified: true
    },
    {
      _id: 'usr_supplier_3',
      name: 'Apex Merch & Textiles Pvt Ltd',
      email: 'seller3',
      phone: '+91 99001 99887',
      password: hash,
      role: 'supplier',
      company: 'Apex Custom Products & Apparel',
      location: 'Bengaluru, India',
      rating: 4.8,
      completedOrders: 220,
      verified: true
    },
    {
      _id: 'usr_supplier_4',
      name: 'BargainBazaar Liquidators',
      email: 'seller4',
      phone: '+91 94440 11223',
      password: hash,
      role: 'supplier',
      company: 'Bargain Surplus Clearing Hub',
      location: 'Chennai, India',
      rating: 3.1,
      completedOrders: 14,
      verified: false
    }
  ];

  const rfqs = [
    {
      _id: 'rfq_planners_1',
      buyerId: 'usr_buyer_1',
      title: '5,000 Custom Hardbound Executive Planners & Spiral Notebooks',
      category: 'Stationery',
      description: 'Corporate annual welcome kit with 80 GSM acid-free ruled paper, vegan leather hardbound cover with debossed gold foil logo, elastic closure band, and ribbon bookmark.',
      rawPrompt: 'Need 5,000 custom-made executive planners delivered to Hyderabad within 10 days, 80 GSM paper, gold foil corporate logo, target budget ₹3,75,000.',
      quantity: 5000,
      unit: 'planners',
      targetBudget: 375000,
      targetPrice: 375000,
      deliveryCity: 'Hyderabad',
      location: 'Hyderabad',
      deadlineDays: 10,
      deliveryDays: 10,
      specs: {
        'Paper Weight': '80 GSM Acid-Free Cream Woodfree',
        'Cover Material': 'Vegan Leatherette Hardbound with Gold Foil',
        'Binding Type': 'Twin Wire-O Concealed Spiral',
        'Pages': '192 Ruled Pages with Monthly Planner & Calendar'
      },
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      _id: 'rfq_corrugated_2',
      buyerId: 'usr_buyer_2',
      title: '25,000 Heavy-Duty Corrugated Shipping Boxes (3-Ply Kraft)',
      category: 'Packaging',
      description: 'E-commerce logistics standard 3-ply kraft corrugated carton boxes (12 x 10 x 8 inches). Outer liner 180 GSM virgin kraft, edge crush test 32 ECT, bursting strength 14 kg/cm².',
      rawPrompt: 'Looking for 25,000 kraft delivery boxes (12x10x8 inch) delivered to Bengaluru within 12 days, certified 3-ply corrugated, target budget ₹3,25,000.',
      quantity: 25000,
      unit: 'boxes',
      targetBudget: 325000,
      targetPrice: 325000,
      deliveryCity: 'Bengaluru',
      location: 'Bengaluru',
      deadlineDays: 12,
      deliveryDays: 12,
      specs: {
        'Box Dimensions': '12 x 10 x 8 inches (Outer)',
        'Board Grade': '3-Ply B-Flute 180 GSM Virgin Kraft',
        'Bursting Strength': '14 kg/cm² (IS:1060 Certified)',
        'Printing': 'Single-Color Flexo Hazard & Brand Mark'
      },
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      _id: 'rfq_hoodies_3',
      buyerId: 'usr_buyer_1',
      title: '1,200 Heavyweight Bio-Washed Cotton Hoodies (Tech Summit 2026)',
      category: 'Apparel',
      description: 'Premium merchandise hoodies for annual APAC developer symposium. 320 GSM 100% combed ring-spun cotton fleece, bio-washed and pre-shrunk, fleece-lined hood, 4-color high-density embroidered logo.',
      rawPrompt: 'Need 1,200 premium black hoodies for national developer conference in Pune, 320 GSM combed cotton fleece, embroidered logo, 14 days delivery, budget ₹7,80,000.',
      quantity: 1200,
      unit: 'hoodies',
      targetBudget: 780000,
      targetPrice: 780000,
      deliveryCity: 'Pune',
      location: 'Pune',
      deadlineDays: 14,
      deliveryDays: 14,
      specs: {
        'Fabric': '100% Combed Cotton 320 GSM Brushed Fleece',
        'Embroidery': 'High-Density 4-Color Tajima Stitching',
        'Sizes Assortment': 'S: 150, M: 400, L: 450, XL: 200',
        'Finishing': 'Bio-wash, Silicon Softener, Anti-Pilling'
      },
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      _id: 'rfq_chairs_4',
      buyerId: 'usr_buyer_1',
      title: '450 High-Back Ergonomic Mesh Task Chairs (BIFMA Certified)',
      category: 'Industrial',
      description: 'Commercial office seating for newly expanded IT development centre. Breathable Korean mesh back, 3D adjustable armrests, multi-lock synchro-tilt mechanism, Class 4 hydraulic gas lift cylinder.',
      rawPrompt: 'Require 450 ergonomic mesh office chairs in Mumbai within 15 days, BIFMA Class 4 hydraulics, synchro-tilt, target budget ₹16,65,000.',
      quantity: 450,
      unit: 'chairs',
      targetBudget: 1665000,
      targetPrice: 1665000,
      deliveryCity: 'Mumbai',
      location: 'Mumbai',
      deadlineDays: 15,
      deliveryDays: 15,
      specs: {
        'Ergonomic Certification': 'BIFMA X5.1 & EN 1335 Tested',
        'Mechanism': 'Synchro-Tilt 4-Position Lock',
        'Gas Lift': 'Class 4 Heavy Duty 120mm Stroke',
        'Warranty': '3 Years On-Site Frame & Mechanism Warranty'
      },
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      _id: 'rfq_masks_5',
      buyerId: 'usr_buyer_2',
      title: '60,000 4-Ply Ultrasonic Welded N95 Respiratory Masks',
      category: 'Medical',
      description: 'Healthcare consortium requirement for hospital network. 4-ply construction with dual meltblown 25 GSM filtration layers, BFE >= 99%, ultrasonic ear loops, foam nose seal.',
      rawPrompt: 'Looking for 60,000 medical grade N95 masks delivered to Delhi within 8 days, CE certified, budget ₹4,80,000.',
      quantity: 60000,
      unit: 'masks',
      targetBudget: 480000,
      targetPrice: 480000,
      deliveryCity: 'Delhi',
      location: 'Delhi',
      deadlineDays: 8,
      deliveryDays: 8,
      specs: {
        'Filtration Media': 'Dual Layer 25 GSM Meltblown (BFE 99%)',
        'Nose Clip': 'Concealed Aluminum Strip with EVA Cushion',
        'Certifications': 'BIS IS:9473, CE & FDA Registered',
        'Packaging': 'Individually Sterile Pouch Wrapped'
      },
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      _id: 'rfq_bagasse_6',
      buyerId: 'usr_buyer_2',
      title: '40,000 Biodegradable Sugarcane Bagasse 3-Compartment Meal Trays',
      category: 'Packaging',
      description: 'Takeaway containers for organic cloud kitchen franchise. 100% compostable sugarcane pulp, oil-proof up to 120°C, microwave and freezer safe, snap-fit spill-resistant PLA lids.',
      rawPrompt: 'Need 40,000 sugarcane bagasse 3-compartment meal containers with tight lids in Chennai, 10 days, target ₹2,80,000.',
      quantity: 40000,
      unit: 'trays',
      targetBudget: 280000,
      targetPrice: 280000,
      deliveryCity: 'Chennai',
      location: 'Chennai',
      deadlineDays: 10,
      deliveryDays: 10,
      specs: {
        'Raw Material': '100% Virgin Sugarcane Bagasse Fiber',
        'Certifications': 'OK Compost EN 13432 & FSSAI Approved',
        'Thermal Tolerance': '-20°C (Freezer) to +140°C (Microwave)',
        'Compartments': '3 Sections (450ml + 180ml + 180ml)'
      },
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  const bids = [
    // Bids for Planners RFQ
    {
      _id: 'bid_planners_1',
      rfqId: 'rfq_planners_1',
      supplierId: 'usr_seller_1',
      supplierName: 'Sunil Mehta (Sri Krishna Print & Pack)',
      supplierRating: 4.9,
      unitPrice: 69,
      totalPrice: 345000,
      price: 345000,
      deliveryDays: 7,
      specComplianceScore: 99,
      warrantyMonths: 12,
      notes: 'Automated Heidelberg German binding line in Hyderabad. Free sample batch inspection and door delivery included.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      _id: 'bid_planners_2',
      rfqId: 'rfq_planners_1',
      supplierId: 'usr_supplier_2',
      supplierName: 'Deccan Paper Mills & Binders',
      supplierRating: 4.6,
      unitPrice: 71,
      totalPrice: 355000,
      price: 355000,
      deliveryDays: 9,
      specComplianceScore: 95,
      warrantyMonths: 6,
      notes: 'Direct mill paper stock. Gold foil hot-stamping plates included at no extra tooling charge.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
    },
    {
      _id: 'bid_planners_3',
      rfqId: 'rfq_planners_1',
      supplierId: 'usr_supplier_3',
      supplierName: 'Apex Merch & Textiles Pvt Ltd',
      supplierRating: 4.8,
      unitPrice: 74,
      totalPrice: 370000,
      price: 370000,
      deliveryDays: 8,
      specComplianceScore: 97,
      warrantyMonths: 24,
      notes: 'Premium Italian PU leatherette finish with bespoke branded gift box packaging for each notebook.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
      _id: 'bid_planners_4',
      rfqId: 'rfq_planners_1',
      supplierId: 'usr_supplier_4',
      supplierName: 'BargainBazaar Liquidators',
      supplierRating: 3.1,
      unitPrice: 32,
      totalPrice: 160000,
      price: 160000,
      deliveryDays: 14,
      specComplianceScore: 60,
      warrantyMonths: 0,
      notes: 'Clearance lot from cancelled exporter order. Paper GSM may vary between 60 to 70 GSM. Non-returnable.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },

    // Bids for Corrugated Boxes RFQ
    {
      _id: 'bid_boxes_1',
      rfqId: 'rfq_corrugated_2',
      supplierId: 'usr_seller_1',
      supplierName: 'Sunil Mehta (Sri Krishna Print & Pack)',
      supplierRating: 4.9,
      unitPrice: 12,
      totalPrice: 300000,
      price: 300000,
      deliveryDays: 8,
      specComplianceScore: 98,
      warrantyMonths: 12,
      notes: 'Fully automated corrugator plant with moisture barrier coating. Direct palletized dispatch to Bengaluru.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      _id: 'bid_boxes_2',
      rfqId: 'rfq_corrugated_2',
      supplierId: 'usr_supplier_2',
      supplierName: 'Deccan Paper Mills & Binders',
      supplierRating: 4.6,
      unitPrice: 12.5,
      totalPrice: 312500,
      price: 312500,
      deliveryDays: 10,
      specComplianceScore: 94,
      warrantyMonths: 6,
      notes: 'Virgin kraft testliner with high crush resistance. Bundled in packs of 25 with strapping.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },

    // Bids for Hoodies RFQ
    {
      _id: 'bid_hoodies_1',
      rfqId: 'rfq_hoodies_3',
      supplierId: 'usr_supplier_3',
      supplierName: 'Apex Merch & Textiles Pvt Ltd',
      supplierRating: 4.8,
      unitPrice: 610,
      totalPrice: 732000,
      price: 732000,
      deliveryDays: 10,
      specComplianceScore: 98,
      warrantyMonths: 12,
      notes: 'Tirupur manufacturing hub. Japanese embroidery machines with Pantone color matching. Individual polybag packed.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
      _id: 'bid_hoodies_2',
      rfqId: 'rfq_hoodies_3',
      supplierId: 'usr_seller_1',
      supplierName: 'Sunil Mehta (Sri Krishna Print & Pack)',
      supplierRating: 4.9,
      unitPrice: 630,
      totalPrice: 756000,
      price: 756000,
      deliveryDays: 12,
      specComplianceScore: 96,
      warrantyMonths: 12,
      notes: 'Pre-shrunk 320 GSM fleece with custom silicon washed finish. Size tags and barcode stickers included.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ];

  // Calculate TOPSIS for each RFQ's bids
  const allRankedBids = [];
  const rfqIds = [...new Set(bids.map(b => b.rfqId))];
  for (const id of rfqIds) {
    const subset = bids.filter(b => b.rfqId === id);
    const ranked = calculateTOPSIS(subset);
    allRankedBids.push(...ranked);
  }

  const orders = [
    {
      _id: 'ord_demo_9821',
      rfqId: 'rfq_planners_1',
      buyerId: 'usr_buyer_1',
      supplierId: 'usr_seller_1',
      winningBidId: 'bid_planners_1',
      totalAmount: 345000,
      advanceAmount: 138000,
      finalAmount: 207000,
      advancePaid: true,
      finalPaid: false,
      advanceUtr: 'UPI-982144781290',
      trackingNumber: 'TRK-982144',
      status: 'in_production',
      milestones: [
        { step: '40% Advance Payment & Raw Material Escrow (Paid ₹1,38,000)', date: new Date(Date.now() - 3600000 * 48).toISOString(), completed: true },
        { step: 'Batch Manufacturing & Quality Inspection (Paper cutting & Binding in progress)', date: new Date().toISOString(), completed: true },
        { step: 'Logistics Dispatch & Waybill Generation', date: new Date(Date.now() + 3600000 * 24).toISOString(), completed: false },
        { step: 'Delivery Reach-out & 60% Final Settlement (Due ₹2,07,000)', date: new Date(Date.now() + 3600000 * 72).toISOString(), completed: false }
      ],
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ];

  await User.insertMany(users);
  await RFQ.insertMany(rfqs);
  await Bid.insertMany(allRankedBids);
  await Order.insertMany(orders);

  console.log('✅ Successfully seeded realistic, high-value B2B procurement data:');
  console.log(`- ${users.length} Verified Users (Buyer & Supplier accounts)`);
  console.log(`- ${rfqs.length} High-Value RFQs across Stationery, Packaging, Apparel, Industrial, Medical`);
  console.log(`- ${allRankedBids.length} Ranked Bids with realistic pricing, lead times, warranties & TOPSIS scores`);
  console.log(`- ${orders.length} Milestone Escrow Order with 40% Advance / 60% Final`);

  await mongoose.disconnect();
};

runReseed().catch(console.error);
