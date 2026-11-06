import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gavel, 
  Clock, 
  TrendingDown, 
  Award, 
  Send, 
  AlertTriangle,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LiveAuctionModal = ({ isOpen, onClose, rfq, onBidPlaced }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min countdown
  const [price, setPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('7');
  const [warrantyMonths, setWarrantyMonths] = useState('12');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !rfq) return;

    // Load existing bids
    const fetchBids = async () => {
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
        console.error('Failed to load bids', e);
        setBids([]);
      }
    };
    fetchBids();

    if (socket) {
      socket.emit('join_auction', rfq._id);

      const handleBidUpdate = (newBid) => {
        if (!newBid) return;
        const normalized = {
          ...newBid,
          price: newBid.price || newBid.totalPrice || 0,
          totalPrice: newBid.totalPrice || newBid.price || 0,
          supplierName: newBid.supplierName || 'Verified Supplier'
        };
        setBids((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          const exists = list.find(b => b._id === normalized._id);
          if (exists) {
            return list.map(b => b._id === normalized._id ? normalized : b);
          }
          return [normalized, ...list];
        });
      };

      socket.on('bid_update', handleBidUpdate);

      return () => {
        socket.emit('leave_auction', rfq._id);
        socket.off('bid_update', handleBidUpdate);
      };
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, rfq, socket]);

  if (!isOpen || !rfq) return null;

  const safeBids = Array.isArray(bids) ? bids : [];

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Find lowest price
  const lowestBid = safeBids.length > 0 
    ? [...safeBids].sort((a, b) => (a.price || a.totalPrice) - (b.price || b.totalPrice))[0] 
    : null;

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    const numPrice = Number(price);
    if (!numPrice || numPrice <= 0) {
      setError('Please enter a valid quote price');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post('/bids', {
        rfqId: rfq._id,
        supplierId: user?._id || user?.id || 'usr_seller_1',
        supplierName: user?.company || user?.name || 'Verified Supplier',
        price: numPrice,
        totalPrice: numPrice,
        deliveryDays: Number(deliveryDays),
        warrantyMonths: Number(warrantyMonths),
        paymentTerms: '40% Adv / 60% Final',
      });

      const newBid = res.data?.bid || res.data;
      const normalized = {
        ...newBid,
        price: newBid?.price || newBid?.totalPrice || numPrice,
        totalPrice: newBid?.totalPrice || newBid?.price || numPrice,
        supplierName: newBid?.supplierName || user?.company || user?.name || 'Verified Supplier'
      };

      setBids((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const exists = list.find(b => b._id === normalized._id);
        if (exists) return list.map(b => b._id === normalized._id ? normalized : b);
        return [normalized, ...list];
      });

      // Socket broadcast
      if (socket) {
        socket.emit('submit_bid', {
          rfqId: rfq._id,
          bid: normalized,
        });
      }

      setPrice('');
      if (onBidPlaced) onBidPlaced(normalized);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place quote');
    } finally {
      setSubmitting(false);
    }
  };

  const targetBudget = rfq.targetBudget || rfq.targetPrice || 50000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 text-gray-400 hover:text-gray-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Reverse Auction</span>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">{rfq.title}</h3>
            <p className="text-xs text-gray-500">
              Quantity: <strong className="text-gray-800">{rfq.quantity?.toLocaleString('en-IN')} {rfq.unit || 'units'}</strong> • Target: ₹{targetBudget.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200 text-right">
            <span className="text-[10px] uppercase font-bold text-brand-600 block flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" /> Time Remaining
            </span>
            <span className="text-xl font-black font-mono text-brand-700">{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* Current Best Offer Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-brand-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <span className="text-xs text-rose-100 font-medium block">Current Leading Lowest Bid</span>
              <span className="text-2xl font-black">
                {lowestBid ? `₹${lowestBid.price?.toLocaleString('en-IN')}` : 'No quotes submitted yet'}
              </span>
            </div>
          </div>
          {lowestBid && (
            <div className="text-right text-xs">
              <div className="font-semibold text-rose-100">{lowestBid.supplierName}</div>
              <div className="text-rose-200 text-[11px]">{lowestBid.deliveryDays} Days • {lowestBid.warrantyMonths}m Warranty</div>
            </div>
          )}
        </div>

        {/* Live Bids Feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-2">
          <span className="text-xs font-bold text-gray-700 block">Real-Time Quotes ({safeBids.length})</span>
          {safeBids.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              Be the first supplier to place a competitive quote!
            </div>
          ) : (
            safeBids.map((b, idx) => {
              const isBest = lowestBid && b._id === lowestBid._id;
              return (
                <div 
                  key={b._id || idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isBest 
                      ? 'bg-rose-50/70 border-brand-300 shadow-sm ring-1 ring-brand-300' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isBest ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        {b.supplierName}
                        {isBest && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                            Leading
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {b.deliveryDays} days delivery • {b.warrantyMonths} mo warranty
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-gray-900">
                      ₹{b.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">
                      ₹{(b.price / (rfq.quantity || 1)).toFixed(2)}/unit
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Supplier Bid Form */}
        <div className="pt-3 border-t border-rose-100">
          <form onSubmit={handleSubmitBid} className="space-y-3">
            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Total Quote (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 485000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Delivery Lead Time</label>
                <select
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="3">3 Days (Express)</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days (Standard)</option>
                  <option value="14">14 Days</option>
                  <option value="21">21 Days</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Warranty Period</label>
                <select
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span>Broadcasting quote...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Real-Time Quote into Auction</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LiveAuctionModal;
