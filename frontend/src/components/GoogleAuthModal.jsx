import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GoogleAuthModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('buyer');

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      role: 'buyer',
      company: 'Zenith Retail Tech',
      phone: '+91 98765 43210',
      bgColor: 'bg-blue-600',
      initials: 'RS',
      subtitle: 'Corporate Procurement Buyer'
    },
    {
      name: 'Sunil Gupta',
      email: 'sunil.gupta@apexmed.in',
      role: 'seller',
      company: 'Apex MedTech Solutions',
      phone: '+91 98111 22334',
      bgColor: 'bg-emerald-600',
      initials: 'SG',
      subtitle: 'Verified Medical Equipment Supplier'
    },
    {
      name: 'Mubarak Ali',
      email: 'mubarak.b2b@gmail.com',
      role: 'buyer',
      company: 'Antigravity Enterprise',
      phone: '+91 98222 33445',
      bgColor: 'bg-purple-600',
      initials: 'MA',
      subtitle: 'Enterprise Buyer'
    }
  ];

  const handleSelectAccount = async (acc) => {
    setSelectedUser(acc.email);
    setSigningIn(true);
    
    // Smooth realistic OAuth authorization delay
    setTimeout(async () => {
      await loginWithGoogle({
        name: acc.name,
        email: acc.email,
        role: acc.role,
        company: acc.company,
        phone: acc.phone
      });
      setSigningIn(false);
      onClose();
    }, 700);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail || !customName) return;

    setSigningIn(true);
    setTimeout(async () => {
      await loginWithGoogle({
        name: customName.trim(),
        email: customEmail.trim(),
        role: customRole,
        company: `${customName.trim()}'s Enterprise`,
        phone: '+91 98765 43210'
      });
      setSigningIn(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative overflow-hidden text-left font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={signingIn}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
          <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">Choose an account</h3>
          <p className="text-xs text-gray-500 mt-1">
            to continue to <strong className="text-gray-900">ReverseMarket B2B</strong>
          </p>
        </div>

        {/* Loading Spinner during OAuth Handshake */}
        {signingIn ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-semibold text-gray-800">
              Signing you in with Google...
            </div>
            <div className="text-xs text-gray-400">Verifying security credentials & nodal escrow access</div>
          </div>
        ) : !customMode ? (
          /* List of Available Google Accounts */
          <div className="divide-y divide-gray-100 my-4">
            {accounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleSelectAccount(acc)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-2xl transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${acc.bgColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                    {acc.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {acc.name}
                    </div>
                    <div className="text-xs text-gray-500">{acc.email}</div>
                    <div className="text-[11px] font-medium text-gray-400 mt-0.5">{acc.subtitle}</div>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 capitalize">
                  {acc.role}
                </span>
              </button>
            ))}

            {/* Use Another Account Button */}
            <button
              onClick={() => setCustomMode(true)}
              className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-50 rounded-2xl transition-all text-left text-gray-700 hover:text-blue-600 cursor-pointer pt-3"
            >
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Use another Google account</span>
            </button>
          </div>
        ) : (
          /* Custom Account Sign-In Form */
          <form onSubmit={handleCustomSubmit} className="space-y-3.5 my-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Anand Mahindra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Google Email Address</label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Account Role in ReverseMarket</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCustomRole('buyer')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    customRole === 'buyer'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Buyer (Procure)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomRole('seller')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    customRole === 'seller'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Supplier (Sell)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Continue →
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Notice */}
        <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 text-center">
          To continue, Google will share your name, email address, and profile details with ReverseMarket.
        </div>

      </div>
    </div>
  );
};

export default GoogleAuthModal;
