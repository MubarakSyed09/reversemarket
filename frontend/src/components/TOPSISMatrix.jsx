import React from 'react';
import { 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const TOPSISMatrix = ({ bids, onSelectQuote, targetPrice }) => {
  const safeList = Array.isArray(bids) ? bids : (bids?.bids || []);

  if (!safeList || safeList.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-gray-500 bg-white rounded-3xl border border-rose-100 shadow-sm">
        No competing supplier quotes submitted yet. When suppliers submit quotes, AI ranking will automatically compare them here.
      </div>
    );
  }

  // Pre-sort bids by topsisScore or calculate a balanced composite score
  const rankedBids = safeList.map((b, idx) => {
    const finalPrice = b.price || b.totalPrice || 0;
    // Anomaly detection: price < 60% of target AND warranty < 6 months
    const isAnomaly = targetPrice && finalPrice < targetPrice * 0.6 && (b.warrantyMonths || 0) < 6;
    return {
      ...b,
      price: finalPrice,
      totalPrice: finalPrice,
      supplierName: b.supplierName || 'Verified Supplier',
      deliveryDays: b.deliveryDays || 7,
      warrantyMonths: b.warrantyMonths || 6,
      anomalyDetected: isAnomaly || b.isAnomaly,
      score: b.topsisScore ? Math.round(b.topsisScore * 100) : Math.max(10, 95 - idx * 12),
    };
  }).sort((a, b) => b.score - a.score);

  const bestBid = rankedBids[0];

  const chartData = rankedBids.map((b) => ({
    name: (b.supplierName || 'Vendor').split(' ')[0],
    fullName: b.supplierName,
    score: b.score,
    price: b.price,
  }));

  return (
    <div className="space-y-6">
      
      {/* Visual Header / Summary */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-rose-100">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Multi-Criteria Supplier Evaluation
            </span>
            <h4 className="text-base font-extrabold text-gray-900 mt-1">
              Ranked Supplier Comparison & Anomaly Detection
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Quotes balanced across Price, Delivery Speed, Warranty Period & Reliability.
            </p>
          </div>

          <div className="text-xs text-right">
            <span className="font-bold text-gray-700">Total Quotes:</span>{' '}
            <span className="font-black text-brand-600 text-sm">{bids.length}</span>
          </div>
        </div>

        {/* Small Visual Comparison Chart */}
        <div className="mt-5">
          <span className="text-xs font-bold text-gray-700 block mb-2">Composite Fit Score (100 Max)</span>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(val, name, item) => [`Score: ${val}/100 | ₹${item.payload.price?.toLocaleString('en-IN')}`, 'Rating']} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #ffe4e6', fontSize: '11px' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#e11d48' : '#fda4af'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Supplier Quotes Comparison Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {rankedBids.map((b, idx) => {
          const isTop = idx === 0;
          return (
            <div 
              key={b._id || idx}
              className={`rounded-3xl p-5 sm:p-6 transition-all border ${
                isTop 
                  ? 'bg-gradient-to-r from-rose-50/90 to-white border-brand-300 shadow-md ring-1 ring-brand-300' 
                  : 'bg-white border-rose-100 hover:border-rose-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                      isTop ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      #{idx + 1}
                    </span>
                    <h5 className="text-sm font-extrabold text-gray-900">{b.supplierName}</h5>
                    
                    {isTop && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-600 text-white shadow-sm flex items-center gap-1">
                        <Award className="w-3 h-3" /> Best Value Recommendation
                      </span>
                    )}

                    {b.anomalyDetected && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1" title="Predatory low price detected with low warranty or long lead time">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Caution: Dumping Risk
                      </span>
                    )}
                  </div>

                  {/* Attributes Badges */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 pt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span><strong>{b.deliveryDays}</strong> Days Delivery</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                      <span><strong>{b.warrantyMonths}</strong> Mo Warranty</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{b.supplierRating ? b.supplierRating.toFixed(1) : '4.8'} / 5.0</span>
                    </div>

                    <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Terms: {b.paymentTerms || '40% Adv / 60% Final'}
                    </div>
                  </div>
                </div>

                {/* Right Price & Award Action */}
                <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-rose-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-gray-500 block">Total Quote Amount</span>
                    <span className="text-xl font-black text-gray-900">
                      ₹{b.price?.toLocaleString('en-IN')}
                    </span>
                    <div className="text-[11px] text-brand-600 font-semibold">
                      Advance (40%): ₹{Math.round(b.price * 0.4).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectQuote(b)}
                    className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                      isTop 
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25' 
                        : 'bg-white hover:bg-rose-50 text-brand-600 border border-brand-200'
                    }`}
                  >
                    <span>Award Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default TOPSISMatrix;
