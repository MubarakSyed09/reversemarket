import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  QrCode, 
  Truck, 
  PackageCheck, 
  Building2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import PaymentQRModal from '../components/PaymentQRModal';
import api from '../services/api';

const OrdersView = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeModalOrder, setActiveModalOrder] = useState(null);
  const [modalStage, setModalStage] = useState('advance'); // 'advance' | 'final'

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      const orderList = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
      setOrders(orderList);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenPayment = (order, stage) => {
    setActiveModalOrder(order);
    setModalStage(stage);
  };

  const handleSimulateDelivery = async (orderId) => {
    try {
      // Simulate supplier delivering item
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: 'delivered',
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePaymentSuccess = (updatedOrder) => {
    setOrders((prev) => 
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-6 sm:p-8 border border-rose-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-xs uppercase tracking-wider border border-rose-200 inline-block mb-2">
            Escrow Settlement Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Two-Stage Milestone Orders & Payments
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Buyer funds are held in ICICI nodal escrow. 40% unlocks raw materials; 60% releases only after inspection and sign-off.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-rose-200 text-xs font-bold text-gray-700 hover:bg-rose-50 transition-all shadow-xs self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-xs">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading escrow contract records...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <p className="text-sm font-bold text-gray-700">No active orders or contracts found</p>
          <p className="text-xs text-gray-400 mt-1">Award a quote from the Buyer Hub to initiate a milestone contract.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isAdvanceDone = order.advancePaid || order.escrowStatus === 'advance_paid' || order.escrowStatus === 'completed';
            const isDelivered = order.status === 'delivered' || order.status === 'completed';
            const isFinalDone = order.finalPaid || order.escrowStatus === 'completed';

            return (
              <div 
                key={order._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-600">Order #{order._id}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 font-medium">
                        Supplier: <strong className="text-gray-900">{order.supplierName}</strong>
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mt-1">
                      Total Contract Value: <span className="text-brand-700">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      isFinalDone 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : isAdvanceDone 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isFinalDone ? '100% Fully Settled' : isAdvanceDone ? 'Production In Progress' : 'Awaiting 40% Advance'}
                    </span>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="relative py-2">
                  <div className="flex items-center justify-between relative z-10 text-center">
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow">
                        ✓
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-1">Contract Awarded</span>
                    </div>

                    {/* Step 2: 40% Advance */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                        isAdvanceDone ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-brand-600 ring-2 ring-brand-400'
                      }`}>
                        {isAdvanceDone ? '✓' : '40%'}
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-1">Advance Escrow</span>
                    </div>

                    {/* Step 3: Production & Dispatch */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                        isDelivered ? 'bg-emerald-500 text-white' : isAdvanceDone ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-1">Dispatch & Delivery</span>
                    </div>

                    {/* Step 4: 60% Final Settlement */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                        isFinalDone ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isFinalDone ? '✓' : '60%'}
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 mt-1">Final Release</span>
                    </div>

                  </div>
                </div>

                {/* Two-Stage Payment Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* STAGE 1: 40% ADVANCE */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isAdvanceDone ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/70 border-brand-300 ring-1 ring-brand-300'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Milestone 1 • 40% Advance
                      </span>
                      {isAdvanceDone ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Paid into Escrow
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Pending Payment
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-black text-gray-900 mb-1">
                      ₹{order.advanceAmount?.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-gray-600 mb-4">
                      Unlocks supplier raw material sourcing and manufacturing.
                    </p>

                    {!isAdvanceDone ? (
                      <button
                        onClick={() => handleOpenPayment(order, 'advance')}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Pay 40% Advance via UPI QR</span>
                      </button>
                    ) : (
                      <div className="text-xs text-emerald-700 font-semibold bg-white/80 p-2 rounded-xl border border-emerald-200 text-center">
                        Locked safely in escrow. Supplier notified to proceed.
                      </div>
                    )}
                  </div>

                  {/* STAGE 2: 60% FINAL */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isFinalDone 
                      ? 'bg-emerald-50/60 border-emerald-200' 
                      : isAdvanceDone 
                      ? 'bg-white border-rose-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Milestone 2 • 60% Settlement
                      </span>
                      {isFinalDone ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Settled to Supplier
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Due upon inspection
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-black text-gray-900 mb-1">
                      ₹{order.finalAmount?.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-gray-600 mb-4">
                      Released only after buyer confirms goods arrival & quality check.
                    </p>

                    {isFinalDone ? (
                      <div className="text-xs text-emerald-700 font-semibold bg-white/80 p-2 rounded-xl border border-emerald-200 text-center">
                        Contract complete. 100% payment disbursed.
                      </div>
                    ) : isAdvanceDone ? (
                      <div className="space-y-2">
                        {!isDelivered && (
                          <button
                            onClick={() => handleSimulateDelivery(order._id)}
                            className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-all flex items-center justify-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Simulate: Supplier Dispatched & Delivered</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenPayment(order, 'final')}
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Inspect & Release 60% Settlement</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 font-medium text-center py-2">
                        Requires Milestone 1 advance payment first
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* UPI QR Payment Modal */}
      <PaymentQRModal
        isOpen={!!activeModalOrder}
        onClose={() => setActiveModalOrder(null)}
        order={activeModalOrder}
        stage={modalStage}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};

export default OrdersView;
