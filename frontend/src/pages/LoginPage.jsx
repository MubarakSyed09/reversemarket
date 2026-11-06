import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from '../components/GoogleAuthModal';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Handshake,
  Zap,
  TrendingUp,
  ArrowRight, 
  User, 
  Phone, 
  MapPin, 
  Building2,
  Briefcase,
  Sparkles
} from 'lucide-react';

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [error, setError] = useState(null);

  // Sign In Form State
  const [userId, setUserId] = useState('buyer_rahul');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [regUserId, setRegUserId] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('buyer');
  const [regCompany, setRegCompany] = useState('');
  const [regCity, setRegCity] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!userId.trim() || !password) {
      setError('Please enter your User ID and password');
      return;
    }

    const res = await login(userId.trim(), password);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!regUserId.trim() || !regPassword || !regName.trim() || !regPhone.trim()) {
      setError('Please fill out all required fields');
      return;
    }

    const res = await register({
      userId: regUserId.trim().toLowerCase(),
      name: regName.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      role: regRole,
      company: regCompany.trim() || `${regName}'s Firm`,
      city: regCity.trim() || 'Mumbai',
    });

    if (!res.success) {
      setError(res.error);
    }
  };

  const fillQuickDemo = (demoUser, demoPass) => {
    setUserId(demoUser);
    setPassword(demoPass);
    setIsRegister(false);
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col justify-between overflow-x-hidden select-none bg-[#fdf2f4] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/assets/login_bg.png')` }}
    >
      {/* Top Header Navbar */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        {/* Brand Logo with Cart */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 text-brand-600 flex items-center justify-center">
            <svg className="w-7 h-7 fill-brand-600" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">
            Reverse<span className="text-brand-600">Market</span>
          </span>
        </div>

        {/* Top Right Tagline */}
        <div className="text-right">
          <span className="text-xs sm:text-sm font-bold text-gray-800 italic tracking-wide">
            Smart Trading. <span className="border-b-2 border-brand-500 pb-0.5">Better Deals.</span>
          </span>
        </div>
      </header>

      {/* Main Split Screen Container */}
      <main className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-10 py-2 sm:py-6 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT SIDE (Headlines + 3 Feature Badges) ================= */}
          <div className="lg:col-span-7 flex flex-col justify-start items-start text-left space-y-5 pt-2 pb-6">
            
            {/* Heading text */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Welcome <span className="text-brand-600">Back!</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-md font-medium leading-relaxed">
                Log in to continue finding the best suppliers and smarter deals.
              </p>
            </div>

            {/* 3 Distinct Feature Badges from Mockup */}
            <div className="flex items-center gap-6 sm:gap-8 pt-3 pb-2">
              
              {/* Badge 1: Connect with Suppliers */}
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-rose-100/90 border border-rose-200/70 flex items-center justify-center text-brand-600 shadow-xs group-hover:scale-105 transition-transform">
                  <Handshake className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-gray-700 mt-2 leading-tight max-w-[85px]">
                  Connect with Suppliers
                </span>
              </div>

              {/* Badge 2: Get the Best Deals */}
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-rose-100/90 border border-rose-200/70 flex items-center justify-center text-brand-600 shadow-xs group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-gray-700 mt-2 leading-tight max-w-[85px]">
                  Get the Best Deals
                </span>
              </div>

              {/* Badge 3: Grow Your Business */}
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-rose-100/90 border border-rose-200/70 flex items-center justify-center text-brand-600 shadow-xs group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-gray-700 mt-2 leading-tight max-w-[85px]">
                  Grow Your Business
                </span>
              </div>

            </div>

            {/* Natural visual space for the photorealistic shopping cart on the floor */}
            <div className="min-h-[160px] sm:min-h-[220px] w-full pointer-events-none" />

          </div>

          {/* ================= RIGHT SIDE (The Interactive White Card) ================= */}
          <div className="lg:col-span-5 w-full max-w-[420px] mx-auto lg:ml-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-rose-950/15 border border-white/90 relative">
              
              {/* Card Title */}
              <div className="text-center mb-5">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {isRegister ? (
                    <>Create your <span className="text-brand-600">Account</span></>
                  ) : (
                    <>Sign in to <span className="text-brand-600">ReverseMarket</span></>
                  )}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {isRegister 
                    ? 'Join as a Buyer or Verified Supplier with your credentials' 
                    : 'Access your demand dashboard and live reverse auctions'}
                </p>
              </div>

              {/* Quick Demo Pre-fill Bar */}
              <div className="mb-4 bg-rose-50/80 border border-rose-100/90 rounded-2xl px-3.5 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-brand-700">
                  <Zap className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
                  <span>Quick Demo:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('buyer_rahul', 'password123')}
                    className="px-3 py-1 rounded-full text-xs font-bold text-brand-700 bg-white hover:bg-rose-50 border border-rose-200/80 shadow-xs transition-all cursor-pointer"
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('seller_sunil', 'password123')}
                    className="px-3 py-1 rounded-full text-xs font-bold text-brand-700 bg-white hover:bg-rose-50 border border-rose-200/80 shadow-xs transition-all cursor-pointer"
                  >
                    Supplier
                  </button>
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-3.5 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Form: LOGIN MODE */}
              {!isRegister ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {/* User ID Input */}
                  <div className="relative rounded-2xl border border-gray-200/90 bg-white/90 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="buyer_rahul"
                      className="w-full pl-10 pr-4 py-3 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative rounded-2xl border border-gray-200/90 bg-white/90 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Remember me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer accent-brand-600"
                      />
                      <span className="text-gray-700 font-medium">Remember me</span>
                    </label>

                    <button 
                      type="button"
                      onClick={() => alert('Demo password is password123')}
                      className="text-brand-600 hover:text-brand-700 font-bold hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Crimson Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Log In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200/80" />
                    </div>
                    <div className="relative flex justify-center text-[11px]">
                      <span className="bg-white px-3 text-gray-400 font-medium">or continue with</span>
                    </div>
                  </div>

                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200/90 shadow-xs flex items-center justify-center gap-2.5 text-xs font-bold text-gray-700 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Switch to Sign Up */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500">
                      New to ReverseMarket?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsRegister(true); setError(null); }}
                        className="text-brand-600 font-extrabold hover:underline cursor-pointer"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Form: REGISTER MODE */
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  {/* Role Selector Pills */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setRegRole('buyer')}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                        regRole === 'buyer' 
                          ? 'bg-brand-600 text-white shadow-xs' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Buyer Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('seller')}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                        regRole === 'seller' 
                          ? 'bg-brand-600 text-white shadow-xs' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Supplier Account
                    </button>
                  </div>

                  {/* Full Name */}
                  <div className="relative rounded-2xl border border-gray-200 bg-white/90 focus-within:ring-2 focus-within:ring-brand-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  {/* User ID */}
                  <div className="relative rounded-2xl border border-gray-200 bg-white/90 focus-within:ring-2 focus-within:ring-brand-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regUserId}
                      onChange={(e) => setRegUserId(e.target.value)}
                      placeholder="Choose User ID (e.g. rahul_buyer)"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="relative rounded-2xl border border-gray-200 bg-white/90 focus-within:ring-2 focus-within:ring-brand-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 Phone Number"
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative rounded-2xl border border-gray-200 bg-white/90 focus-within:ring-2 focus-within:ring-brand-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-10 py-2.5 bg-transparent text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-rose-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsRegister(false); setError(null); }}
                        className="text-brand-600 font-extrabold hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* Bottom Terms & Policy */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">
                  By logging in, you agree to our{' '}
                  <a href="#terms" className="text-brand-600 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-brand-600 hover:underline">Privacy Policy</a>.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Google OAuth Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </div>
  );
};

export default LoginPage;
