import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  Lock, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

const PaymentQRModal = ({ isOpen, onClose, order, stage, onPaymentSuccess }) => {
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !order) return null;

  const isAdvance = stage === 'advance';
  const amount = isAdvance ? order.advanceAmount : order.finalAmount;
  const percentage = isAdvance ? '40%' : '60%';
  const stageTitle = isAdvance ? 'Stage 1: Advance Milestone Payment (40%)' : 'Stage 2: Final Delivery Settlement (60%)';
  const stageDesc = isAdvance 
    ? 'Advance locked into Escrow to release raw material procurement to supplier.'
    : 'Final settlement to release payout after buyer inspection and delivery sign-off.';

  // Build standard UPI intent URI
  const upiId = 'reversemarket.escrow@icici';
  const payeeName = 'ReverseMarket Escrow';
  const note = `${order._id} - ${stageTitle}`;
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}`;

  const handleSimulatePayment = async () => {
    setPaying(true);
    setError(null);
    try {
      const endpoint = isAdvance 
        ? `/orders/${order._id}/pay-advance` 
        : `/orders/${order._id}/pay-final`;
      
      const res = await api.post(endpoint, {
        transactionId: `UPI_${Date.now()}_${Math.floor(Math.random() * 10000)}`
      });

      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(res.data.order);
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 text-gray-400 hover:text-gray-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full border border-rose-200 uppercase tracking-wide">
            Two-Stage Escrow
          </span>
          <span className="text-xs text-gray-500 font-medium">Order #{order._id}</span>
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 mt-2">
          {stageTitle}
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          {stageDesc}
        </p>

        {/* Amount Card */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-600 block">Milestone Amount Payable</span>
            <div className="text-2xl sm:text-3xl font-black text-brand-700 mt-0.5">
              ₹{amount?.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              Total Contract: ₹{order.totalAmount?.toLocaleString('en-IN')} ({percentage} split)
            </span>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Safe
            </span>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border-2 border-dashed border-rose-200 my-4 shadow-inner">
          {success ? (
            <div className="py-12 flex flex-col items-center text-center animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-3" />
              <h4 className="text-lg font-bold text-gray-900">Payment Verified!</h4>
              <p className="text-xs text-gray-500 mt-1">Escrow milestone status updated immediately.</p>
            </div>
          ) : (
            <>
              <div className="p-2 bg-white rounded-xl shadow-md border border-gray-100 mb-3">
                <img 
                  src={qrUrl} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                  onError={(e) => {
                    // Fallback to local SVG generator if external QR service is blocked
                    e.target.onerror = null;
                    e.target.src = `https://chart.googleapis.com/chart?chs=240x240&cht=qr&chl=${encodeURIComponent(upiUri)}&choe=UTF-8`;
                  }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Smartphone className="w-4 h-4 text-brand-600" />
                <span>Scan with Google Pay, PhonePe, Paytm, or BHIM</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                UPI ID: <span className="font-bold text-gray-800">{upiId}</span>
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        {!success && (
          <div className="space-y-2.5">
            <button
              onClick={handleSimulatePayment}
              disabled={paying}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {paying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Transaction on UPI Network...</span>
                </>
              ) : (
                <>
                  <span>Simulate Instant UPI Payment (₹{amount?.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Funds held securely in ICICI nodal escrow until milestone release</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentQRModal;
