import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  TrendingDown, 
  Clock, 
  Users, 
  CheckCircle2, 
  Building2, 
  Award, 
  Sparkles, 
  DollarSign, 
  Layers, 
  ChevronRight,
  Star,
  Lock,
  BarChart3,
  Flame,
  ArrowUpRight
} from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('buyer');

  const liveAuctions = [
    {
      id: 'RFQ-2026-081',
      title: '5,000 Custom PU Executive Planners',
      category: 'Corporate Merchandise',
      targetPrice: '₹420/unit',
      currentLowest: '₹345/unit',
      savings: '17.8%',
      bidsCount: 14,
      timeLeft: '04h : 18m',
      status: 'Live Auction',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'RFQ-2026-082',
      title: '25,000 5-Ply Corrugated Shipping Boxes',
      category: 'Packaging & Logistics',
      targetPrice: '₹32/box',
      currentLowest: '₹24.50/box',
      savings: '23.4%',
      bidsCount: 22,
      timeLeft: '01h : 42m',
      status: 'High Demand',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'RFQ-2026-083',
      title: '1,200 Heavyweight Fleece Hoodies (340 GSM)',
      category: 'Textiles & Apparel',
      targetPrice: '₹750/pc',
      currentLowest: '₹610/pc',
      savings: '18.6%',
      bidsCount: 9,
      timeLeft: '08h : 05m',
      status: 'Live Auction',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const features = [
    {
      icon: <TrendingDown className="w-6 h-6 text-brand-600" />,
      title: "Real-Time Reverse Bidding",
      description: "Post your detailed procurement demand and watch verified suppliers actively lower their bids in a live, transparent countdown arena."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-600" />,
      title: "TOPSIS Multi-Criteria AI",
      description: "Never sacrifice quality for lowest cost. Our AI weighs unit price, supplier SLA rating, lead time, and payment flexibility into one unified ranking."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
      title: "40/60 Milestone Escrow",
      description: "Funds are locked securely in escrow via UPI/NetBanking. 40% released on order acceptance, and 60% only after warehouse QC barcode confirmation."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-600" />,
      title: "Anti-Collusion AI Shield",
      description: "Automated real-time telemetry flags abnormal bidding rings, predatory pricing, and ghost IP clustering to safeguard fair market pricing."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff0f3] via-[#fff5f7] to-[#fff0f3] text-gray-900 font-sans flex flex-col">
      {/* ================= TOP NAVIGATION ================= */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-rose-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onLogin}>
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-xs">
              <svg className="w-6 h-6 fill-brand-600" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-gray-900 leading-tight">
                Reverse<span className="text-brand-600">Market</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-500">
                B2B Procurement Exchange
              </span>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#live-auctions" className="hover:text-brand-600 transition-colors">Live Auctions</a>
            <a href="#features" className="hover:text-brand-600 transition-colors">Key Features</a>
            <a href="#escrow" className="hover:text-brand-600 transition-colors">Escrow Protection</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-sm font-bold text-gray-700 hover:text-brand-600 px-4 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onLogin}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 text-white text-sm font-bold shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Background decorative radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-rose-200/40 via-pink-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-200/80 shadow-xs text-xs font-bold text-brand-600 mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span>Next-Gen Enterprise Procurement & Dynamic Reverse Auctions</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
              Procurement in Reverse: <br />
              <span className="bg-gradient-to-r from-brand-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                Post Demand. Watch Suppliers Compete.
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Replace slow vendor negotiations with real-time dynamic bidding. Save an average of 
              <strong className="text-brand-600 font-bold"> 21.4% </strong> on bulk procurement with TOPSIS AI matching and automated 40/60 milestone escrow.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 text-white font-bold text-base shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Launch Marketplace</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border border-rose-200 text-gray-800 font-bold text-base shadow-xs hover:bg-rose-50/50 hover:border-rose-300 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5 text-brand-500" />
                <span>Explore Live RFQs</span>
              </button>
            </div>

            {/* Trust Stats Bar */}
            <div className="mt-12 pt-8 border-t border-rose-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-rose-100">
                <div className="text-2xl sm:text-3xl font-black text-gray-900">₹4.8 Cr+</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Procurement GMV</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-rose-100">
                <div className="text-2xl sm:text-3xl font-black text-brand-600">21.4%</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Average Cost Savings</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-rose-100">
                <div className="text-2xl sm:text-3xl font-black text-gray-900">1,450+</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Verified Indian Suppliers</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-rose-100">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">Escrow Payment Safety</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIVE AUCTION TICKER PREVIEW ================= */}
      <section id="live-auctions" className="py-12 bg-white border-y border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                Live Reverse Bidding Feed
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Active B2B Demands Under Negotiation
              </h2>
            </div>
            <button
              onClick={onLogin}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline"
            >
              <span>View all 38 active RFQs</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveAuctions.map((auction) => (
              <div 
                key={auction.id}
                onClick={onLogin}
                className="group cursor-pointer bg-gradient-to-b from-white to-rose-50/40 rounded-2xl border border-rose-100 hover:border-brand-300 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${auction.badgeColor}`}>
                    {auction.status}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    {auction.timeLeft}
                  </span>
                </div>

                <h3 className="text-base font-black text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {auction.title}
                </h3>
                <p className="text-xs font-medium text-gray-500 mb-4">{auction.category}</p>

                <div className="bg-white rounded-xl p-3 border border-rose-100/80 mb-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Target Ceiling:</span>
                    <span className="font-bold text-gray-800 line-through">{auction.targetPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700">Current Lowest:</span>
                    <span className="font-black text-emerald-600 text-base">{auction.currentLowest}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rose-100 text-xs">
                  <span className="font-bold text-brand-600 bg-rose-50 px-2 py-0.5 rounded">
                    Save {auction.savings}
                  </span>
                  <span className="font-semibold text-gray-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {auction.bidsCount} Quotes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-[#fff0f3] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest uppercase text-brand-600">Streamlined Procurement</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              How Reverse Auctions Beat Traditional RFQs
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 font-medium">
              A 3-step transparent cycle engineered for maximum efficiency, fair pricing, and fraud-free transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-rose-100 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-brand-600 font-black text-xl flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Post Demand with AI</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  State your required quantities, technical specs, target delivery date, and budget ceiling. Our AI categorizes and broadcasts to verified suppliers instantly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center gap-2 text-xs font-bold text-brand-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant Supplier Notification</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-brand-200 shadow-md relative flex flex-col justify-between">
              <div className="absolute -top-3 right-6 bg-brand-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                Real-Time Arena
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center mb-6 shadow-sm">
                  02
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Live Reverse Auction</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Verified sellers compete transparently to win your purchase order. Watch bids decline in real time while TOPSIS AI ranks each proposal on price, rating, and lead time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center gap-2 text-xs font-bold text-brand-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Price Collusion</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-rose-100 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-brand-600 font-black text-xl flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">40/60 Milestone Escrow</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Accept the winning proposal and lock funds into escrow. 40% initiates production, and the remaining 60% releases only after quality barcode inspection passes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center gap-2 text-xs font-bold text-brand-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Capital Protection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY PLATFORM FEATURES ================= */}
      <section id="features" className="py-20 bg-white border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest uppercase text-brand-600">Enterprise Grade</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Engineered for Precision & Trust
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 font-medium">
              Every feature is built specifically for high-volume enterprise procurement workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-2xl bg-gradient-to-br from-[#fff0f3]/50 to-white border border-rose-100 hover:border-brand-200 hover:shadow-md transition-all flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-rose-200/80 shadow-xs flex items-center justify-center shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BUYERS VS SELLERS VALUE PROP ================= */}
      <section className="py-20 bg-gradient-to-b from-white via-[#fff0f3] to-white border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 rounded-xl bg-rose-100/80 border border-rose-200">
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'buyer' 
                    ? 'bg-brand-600 text-white shadow-xs' 
                    : 'text-gray-700 hover:text-brand-600'
                }`}
              >
                For Enterprise Buyers
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'seller' 
                    ? 'bg-brand-600 text-white shadow-xs' 
                    : 'text-gray-700 hover:text-brand-600'
                }`}
              >
                For Verified Suppliers
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-sm max-w-4xl mx-auto">
            {activeTab === 'buyer' ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900">
                  Save 15%–30% on bulk procurement without vendor phone tag
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Never settle for single-vendor quotes. Post your Bill of Materials (BOM) once and watch pre-vetted, GST-compliant manufacturers compete live for your business.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Automated RFQ distribution to 1,400+ verified factories</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Dynamic AI ranking balances cost, quality, and SLA</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">40/60 milestone escrow protects company liquidity</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Audit-ready PDF quotation logs for finance approval</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900">
                  Get high-ticket Purchase Orders without cold sales outreach
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Bid on pre-funded corporate demands from verified enterprises across India. Win deals with fast turnaround, superior quality, and competitive manufacturing scale.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Direct access to multi-lakh enterprise POs every day</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Guaranteed payment: 40% advance held in verified escrow</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Zero broker cuts: direct buyer communication channel</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-800">Fast 48-hour post-delivery payout settlement</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-rose-100 flex justify-end">
              <button
                onClick={onLogin}
                className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2"
              >
                <span>Enter Marketplace as {activeTab === 'buyer' ? 'Buyer' : 'Supplier'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA BANNER ================= */}
      <section className="py-20 bg-gradient-to-r from-brand-600 via-rose-600 to-pink-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to Cut Procurement Costs Today?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-rose-100 max-w-2xl mx-auto font-medium">
            Join hundreds of Indian businesses sourcing smarter, faster, and cheaper with ReverseMarket.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-brand-600 font-black text-base shadow-lg hover:bg-rose-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Now — It's Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onLogin}>
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <svg className="w-5 h-5 fill-brand-600" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <span className="text-xl font-black text-gray-900">
              Reverse<span className="text-brand-600">Market</span>
            </span>
          </div>

          <div className="text-xs text-gray-500 font-medium text-center">
            © 2026 ReverseMarket Inc. Smart Trading. Better Deals. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-gray-600">
            <button onClick={onLogin} className="hover:text-brand-600">Buyer Portal</button>
            <button onClick={onLogin} className="hover:text-brand-600">Supplier Portal</button>
            <button onClick={onLogin} className="hover:text-brand-600">Security & Escrow</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
