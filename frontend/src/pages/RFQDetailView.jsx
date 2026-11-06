import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Building2, 
  Layers, 
  Gavel, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import TOPSISMatrix from '../components/TOPSISMatrix';
import api from '../services/api';

const RFQDetailView = ({ rfq, onBack, onEnterAuction, onOrderCreated }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [awarding, setAwarding] = useState(false);
  const [error, setError] = useState(null);

  const targetBudget = rfq ? (rfq.targetBudget || rfq.targetPrice || 0) : 0;
  const location = rfq ? (rfq.location || rfq.deliveryCity || 'Mumbai, India') : 'India';
  const deliveryDays = rfq ? (rfq.deliveryDays || rfq.deadlineDays || 10) : 10;

  const fetchBids = async () => {
    if (!rfq?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/bids/rfq/${rfq._id}`);
      const rawList = Array.isArray(res.data) ? res.data : (res.data?.bids || []);
      const formatted = rawList.map(b => ({
        ...b,
        price: b.price || b.totalPrice || 0,
        totalPrice: b.totalPrice || b.price || 0,
        supplierName: b.supplierName || 'Verified Supplier'
      }));
      setBids(formatted);
    } catch (e) {
      console.error(e);
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [rfq?._id]);

  const handleAwardQuote = async (bid) => {
    setAwarding(true);
    setError(null);
    try {
      const res = await api.post('/orders', {
        rfqId: rfq._id,
        bidId: bid._id,
        supplierId: bid.supplierId || 'usr_seller_1',
        supplierName: bid.supplierName || 'Verified Supplier',
        totalAmount: bid.price || bid.totalPrice || targetBudget,
      });

      if (onOrderCreated) {
        onOrderCreated(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to award contract');
    } finally {
      setAwarding(false);
    }
  };

  if (!rfq) return null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-gray-700 transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Demand Listings</span>
        </button>

        <button
          onClick={() => onEnterAuction(rfq)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 border border-brand-200 text-xs font-bold text-brand-700 transition-all"
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>Open Live Reverse Auction</span>
        </button>
      </div>

      {/* RFQ Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-rose-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-rose-50 text-brand-700 font-bold uppercase tracking-wider text-[10px] border border-rose-200">
                {rfq.category || 'Procurement'}
              </span>
              <span className="text-xs text-gray-400">ID: #{rfq._id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {rfq.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-3xl">
              {rfq.rawPrompt || rfq.description}
            </p>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Ceiling Target Budget</span>
            <span className="text-2xl font-black text-brand-700">₹{targetBudget.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3 bg-gray-50 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Quantity</span>
            <span className="text-sm font-extrabold text-gray-900">{rfq.quantity?.toLocaleString('en-IN')} {rfq.unit || 'units'}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Required Delivery</span>
            <span className="text-sm font-extrabold text-gray-900">{deliveryDays} Days</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Delivery Location</span>
            <span className="text-sm font-extrabold text-gray-900 truncate block">{location}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Escrow Milestone</span>
            <span className="text-sm font-extrabold text-emerald-600">40% Adv / 60% Final</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Awarding Loading */}
      {awarding && (
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-xs font-bold text-brand-700 flex items-center justify-center gap-2 animate-pulse">
          <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <span>Generating Smart Contract & Escrow Milestones (40% / 60%)...</span>
        </div>
      )}

      {/* Comparison Section (TOPSIS Ranking) */}
      <div>
        <TOPSISMatrix 
          bids={bids} 
          targetPrice={targetBudget} 
          onSelectQuote={handleAwardQuote} 
        />
      </div>

    </div>
  );
};

export default RFQDetailView;
