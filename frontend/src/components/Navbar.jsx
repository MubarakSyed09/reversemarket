import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  Building2, 
  ShoppingCart, 
  Gavel, 
  FileText, 
  LogOut, 
  Bell, 
  ShieldCheck, 
  RefreshCw,
  Phone,
  User as UserIcon,
  X,
  ExternalLink,
  Check
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onOpenDemand }) => {
  const { user, logout, switchRole } = useAuth();
  const { incomingDemand, notifications, unreadCount, clearDemand, markAllRead } = useSocket();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isBuyer = user?.role === 'buyer';

  const handleToggleRole = (newRole) => {
    switchRole(newRole);
    if (newRole === 'buyer') {
      setActiveTab('buyer');
    } else {
      setActiveTab('supplier');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer select-none" 
              onClick={() => setActiveTab(isBuyer ? 'buyer' : 'supplier')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-brand-500/25">
                R
              </div>
              <div>
                <span className="text-xl font-black text-gray-900 tracking-tight">
                  Reverse<span className="text-brand-600">Market</span>
                </span>
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Demand-Driven B2B
                </span>
              </div>
            </div>

            {/* CENTRAL PROMINENT BUTTON SWITCH: BUYER VS SELLER */}
            <div className="flex items-center bg-rose-50/80 p-1 rounded-full border border-rose-200/70 shadow-xs">
              <button
                type="button"
                onClick={() => handleToggleRole('buyer')}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isBuyer
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-gray-600 hover:text-brand-600 hover:bg-white/60'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buyer Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleRole('seller')}
                className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all relative cursor-pointer ${
                  !isBuyer
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-gray-600 hover:text-brand-600 hover:bg-white/60'
                }`}
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Seller Mode</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute top-1 right-2" />
                )}
              </button>
            </div>

            {/* RIGHT CONTROLS: ESCROW ORDERS, NOTIFICATION BELL, USER PROFILE */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Orders & Escrow shortcut */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-brand-50 text-brand-700 border-brand-300'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-brand-200'
                }`}
                title="View Milestone Contracts & UPI Escrow"
              >
                <FileText className="w-3.5 h-3.5 text-brand-600" />
                <span className="hidden md:inline">Escrow (40/60)</span>
              </button>

              {/* REAL-TIME SELLER NOTIFICATIONS BELL */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfile(false);
                  }}
                  className="relative p-2 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-gray-700 hover:text-brand-600 transition-all cursor-pointer shadow-xs"
                  title="Incoming Buyer Demands"
                >
                  <Bell className="w-4 h-4 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-rose-100 py-3 px-4 z-50 animate-fade-in">
                    <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-600" />
                        <span className="text-xs font-extrabold text-gray-900">Seller Demand Alerts</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[11px] text-brand-600 hover:underline font-semibold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto my-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-gray-400">
                          No alerts right now. Demands posted by buyers will notify you instantly here.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id}
                            className={`py-3 px-2 rounded-2xl transition-all ${
                              n.read ? 'hover:bg-gray-50' : 'bg-rose-50/50 hover:bg-rose-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-bold text-gray-900 block leading-snug">
                                  {n.title}
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium">
                                  Buyer: <strong className="text-gray-700">{n.buyer}</strong> • Target: ₹{Number(n.budget)?.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 flex-shrink-0 font-medium">
                                {n.time}
                              </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                Open for Quotes
                              </span>
                              <button
                                onClick={() => {
                                  setShowNotifications(false);
                                  handleToggleRole('seller');
                                  if (onOpenDemand && n.raw) {
                                    onOpenDemand(n.raw);
                                  }
                                }}
                                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                              >
                                <span>Quote Now</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* USER PROFILE DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-rose-200 bg-white hover:border-brand-400 transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-gray-800 leading-tight">
                      {user?.name || user?.userId || 'User'}
                    </div>
                    <div className="text-[10px] text-brand-600 font-semibold uppercase">
                      {isBuyer ? 'Buyer Account' : 'Seller Account'}
                    </div>
                  </div>
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-rose-100 py-3 px-4 z-50 animate-fade-in">
                    <div className="pb-3 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900">{user?.name || 'Authorized Member'}</p>
                      <p className="text-xs text-brand-600 font-semibold">User ID: @{user?.userId || 'demo'}</p>
                      {user?.phone && (
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-brand-500" />
                          {user?.phone}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-brand-500" />
                        {user?.company || 'Enterprise'} ({user?.city || 'India'})
                      </p>
                    </div>

                    <div className="py-2.5 space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Current Workspace</span>
                        <span className="font-bold text-brand-600 capitalize">
                          {isBuyer ? 'Buyer Mode' : 'Seller Mode'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Escrow Guarantee</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> 40/60 Active
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-brand-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* FLOATING REAL-TIME DEMAND ALERT TOAST (Pops up when a buyer posts an RFQ) */}
      {incomingDemand && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white rounded-3xl p-4 shadow-2xl border-2 border-brand-500 animate-bounce">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                🔔
              </div>
              <div>
                <span className="text-xs font-black text-brand-600 uppercase tracking-wider block">
                  New Buyer Demand!
                </span>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                  {incomingDemand.title}
                </h4>
              </div>
            </div>

            <button
              onClick={clearDemand}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-gray-100">
            <span className="text-gray-500 font-medium">
              Ceiling: <strong className="text-gray-900">₹{Number(incomingDemand.targetBudget || incomingDemand.targetPrice || 50000).toLocaleString('en-IN')}</strong>
            </span>
            <button
              onClick={() => {
                clearDemand();
                handleToggleRole('seller');
                if (onOpenDemand) {
                  onOpenDemand(incomingDemand);
                }
              }}
              className="px-3 py-1 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Bid in Auction</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
