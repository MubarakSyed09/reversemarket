import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  Sparkles, 
  Send, 
  Clock, 
  MapPin, 
  FileText, 
  Gavel, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const BuyerDashboard = ({ onViewRFQ, onEnterAuction }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [rfqs, setRfqs] = useState([]);
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState(null);

  // Sample prompt chips
  const samplePrompts = [
    "Need 5000 units of N95 medical masks in Mumbai within 10 days, budget ₹14/unit",
    "Require 250 ergonomic mesh chairs in Bengaluru by next week, budget ₹3200/chair",
    "Looking for 1200 kg industrial grade copper wiring in Pune, target ₹780/kg"
  ];

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

  const handleCreateRFQ = async (e) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;

    setParsing(true);
    setMessage(null);
    try {
      const res = await api.post('/rfqs', {
        prompt: promptText.trim(),
        buyerId: user?.userId || 'buyer_rahul',
        buyerName: user?.name || 'Rahul Sharma',
        company: user?.company || 'Enterprise Buyer',
        location: user?.city || 'Mumbai',
      });

      // Broadcast to all suppliers via socket
      if (socket) {
        socket.emit('create_rfq', res.data);
      }

      setMessage({ type: 'success', text: 'RFQ extracted and broadcast to suppliers instantly!' });
      setPromptText('');
      fetchRFQs();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to parse demand' });
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-50 via-pink-50 to-rose-100/70 p-6 sm:p-10 border border-rose-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          {/* Top 4 Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold">
            <span className="px-3.5 py-1.5 rounded-full bg-white text-brand-600 border border-rose-200 shadow-xs flex items-center gap-1.5">
              <Gavel className="w-3.5 h-3.5" /> Reverse Auction Engine
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white text-gray-700 border border-rose-200 shadow-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-500" /> Multi-Criteria Matching
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white text-gray-700 border border-rose-200 shadow-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Milestone Escrow (40/60)
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white text-gray-700 border border-rose-200 shadow-xs flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-500" /> Anomaly & Dumping Filter
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Tell Us What You Need, <br className="hidden sm:block" />
            <span className="text-brand-600">Suppliers Compete to Deliver.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Describe your procurement requirement in natural language. Our AI engine extracts technical specifications, broadcasts to verified suppliers, and ranks incoming quotes.
          </p>

          {/* Natural Language Prompt Input Bar */}
          <div className="pt-2 max-w-3xl mx-auto">
            <form onSubmit={handleCreateRFQ} className="relative">
              <div className="relative flex items-center bg-white rounded-3xl shadow-xl shadow-rose-200/40 border-2 border-brand-200 focus-within:border-brand-500 transition-all p-2">
                <div className="pl-3 pr-2 text-brand-600">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="e.g. Need 2000 industrial LED lights in Chennai within 12 days, target ₹450 each..."
                  className="w-full py-3 px-2 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none font-medium"
                />

                <button
                  type="submit"
                  disabled={parsing || !promptText.trim()}
                  className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {parsing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Extracting Specs...</span>
                    </>
                  ) : (
                    <>
                      <span>Broadcast Demand</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Prompt Suggestion Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <span className="text-gray-500 font-bold">Try sample:</span>
              {samplePrompts.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(s)}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-rose-50 text-gray-700 hover:text-brand-600 border border-rose-100 transition-all text-left truncate max-w-[280px] shadow-2xs"
                >
                  "{s}"
                </button>
              ))}
            </div>

            {/* Notification alert */}
            {message && (
              <div className={`mt-3 p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{message.text}</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================= ACTIVE PROCUREMENT DEMANDS ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Demand Listings</h2>
            <p className="text-xs text-gray-500">Live reverse auctions and supplier quotes received</p>
          </div>

          <span className="text-xs font-bold text-brand-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {rfqs.length} Total Demands
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading procurement listings...
          </div>
        ) : rfqs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
            <p className="text-sm font-bold text-gray-700">No active demands posted yet</p>
            <p className="text-xs text-gray-400 mt-1">Use the search bar above to create your first demand in seconds.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rfqs.map((rfq) => (
              <div 
                key={rfq._id}
                className="bg-white rounded-3xl p-6 border border-rose-100 hover:border-brand-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Status & Category */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-brand-700 font-bold uppercase tracking-wider text-[10px] border border-rose-200">
                      {rfq.category || 'General'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active Auction
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-gray-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">
                    {rfq.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {rfq.rawPrompt || rfq.description}
                  </p>

                  {/* Meta Attributes */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-2xl bg-rose-50/50 border border-rose-100/60 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Quantity</span>
                      <strong className="text-gray-800 text-xs">{rfq.quantity?.toLocaleString('en-IN')} {rfq.unit || 'units'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Target Budget</span>
                      <strong className="text-brand-700 text-xs">₹{(rfq.targetPrice || rfq.targetBudget)?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Delivery Days</span>
                      <span className="text-gray-800 text-xs font-semibold">{rfq.deliveryDays || 10} days max</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Location</span>
                      <span className="text-gray-800 text-xs font-semibold truncate block">{rfq.location || 'Pan-India'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onEnterAuction(rfq)}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-brand-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Live Auction</span>
                  </button>

                  <button
                    onClick={() => onViewRFQ(rfq)}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/20"
                  >
                    <span>View Quotes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

    </div>
  );
};

export default BuyerDashboard;
