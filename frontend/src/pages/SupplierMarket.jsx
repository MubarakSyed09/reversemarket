import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  Gavel, 
  Clock, 
  MapPin, 
  TrendingDown, 
  CheckCircle2, 
  Building2, 
  Search, 
  Filter, 
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';

const SupplierMarket = ({ onEnterAuction }) => {
  const { user } = useAuth();
  const { socket, incomingDemand, clearDemand } = useSocket();
  const [rfqs, setRfqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRFQs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rfqs');
      const list = res.data.rfqs || (Array.isArray(res.data) ? res.data : []);
      setRfqs(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();

    if (socket) {
      const handleNewDemand = (newDemand) => {
        if (!newDemand) return;
        setRfqs((prev) => {
          const exists = prev.some((r) => r._id === newDemand._id || r._id === newDemand.id);
          if (exists) return prev;
          return [newDemand, ...prev];
        });
      };

      socket.on('new_rfq', handleNewDemand);
      socket.on('new_rfq_alert', handleNewDemand);

      return () => {
        socket.off('new_rfq', handleNewDemand);
        socket.off('new_rfq_alert', handleNewDemand);
      };
    }
  }, [socket]);

  // Filtered RFQs
  const filteredRFQs = rfqs.filter((r) => {
    const text = `${r.title} ${r.description} ${r.category} ${r.location}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-6 sm:p-8 border border-rose-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-xs uppercase tracking-wider border border-rose-200 inline-block mb-2">
            Supplier Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Live Buyer Demands & Reverse Auctions
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Verified corporate buyers posting real-time procurement requirements. Compete with transparent reverse pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Protected By</span>
            <span className="text-xs font-black text-emerald-600 flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 40% Escrow Advance
            </span>
          </div>
        </div>
      </div>

      {/* Incoming Real-Time Demand Notification Banner */}
      {incomingDemand && (
        <div className="p-4 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/25 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-200 block">
                🚨 New Demand Just In!
              </span>
              <p className="text-sm font-black">{incomingDemand.title}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onEnterAuction(incomingDemand);
              clearDemand();
            }}
            className="px-4 py-2 rounded-xl bg-white text-brand-700 hover:bg-rose-50 font-bold text-xs shadow transition-all flex items-center gap-1.5"
          >
            <span>Bid Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search demands by item, category, location..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-xs rounded-2xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <div className="text-xs font-bold text-gray-500">
          Showing <span className="text-brand-600 font-extrabold">{filteredRFQs.length}</span> active opportunities
        </div>
      </div>

      {/* Demand Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading marketplace opportunities...
        </div>
      ) : filteredRFQs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <p className="text-sm font-bold text-gray-700">No demands match your search</p>
          <p className="text-xs text-gray-400 mt-1">Try clearing keywords or check back in a few minutes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRFQs.map((rfq) => (
            <div 
              key={rfq._id}
              className="bg-white rounded-3xl p-6 border border-rose-100 hover:border-brand-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category & Location */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-brand-700 font-bold uppercase tracking-wider text-[10px] border border-rose-200">
                    {rfq.category || 'Commodity'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <MapPin className="w-3 h-3 text-brand-500" />
                    {rfq.location || 'India'}
                  </span>
                </div>

                <h3 className="font-extrabold text-gray-900 text-base mb-1 line-clamp-1">
                  {rfq.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {rfq.rawPrompt || rfq.description}
                </p>

                {/* Specs Box */}
                <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 text-xs space-y-1.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Required Quantity:</span>
                    <strong className="text-gray-900">{rfq.quantity?.toLocaleString('en-IN')} {rfq.unit || 'units'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Ceiling Budget:</span>
                    <strong className="text-brand-600">₹{(rfq.targetPrice || rfq.targetBudget)?.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Delivery Window:</span>
                    <span className="font-semibold text-gray-800">{rfq.deliveryDays || 14} Days</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200/50 text-[11px]">
                    <span className="text-gray-500">Buyer:</span>
                    <span className="font-bold text-gray-700">{rfq.company || rfq.buyerName}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => onEnterAuction(rfq)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Enter Live Reverse Auction</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SupplierMarket;
