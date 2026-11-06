import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import BuyerDashboard from './pages/BuyerDashboard';
import SupplierMarket from './pages/SupplierMarket';
import RFQDetailView from './pages/RFQDetailView';
import OrdersView from './pages/OrdersView';
import LiveAuctionModal from './components/LiveAuctionModal';

const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'seller' ? 'supplier' : 'buyer');
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [auctionRFQ, setAuctionRFQ] = useState(null);

  // If not authenticated, show the Login Page (matching user reference mockup)
  if (!user) {
    return <LoginPage />;
  }

  const handleViewRFQ = (rfq) => {
    setSelectedRFQ(rfq);
    setActiveTab('buyer');
  };

  const handleBackToRFQs = () => {
    setSelectedRFQ(null);
  };

  const handleEnterAuction = (rfq) => {
    setAuctionRFQ(rfq);
  };

  const handleOrderCreated = (order) => {
    setSelectedRFQ(null);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff0f3] via-[#fff5f7] to-[#fff0f3] flex flex-col font-sans">
      {/* Sticky Top Navbar with Buyer/Seller Switch & Real-time Notifications */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setSelectedRFQ(null);
          setActiveTab(tab);
        }}
        onOpenDemand={(demand) => handleEnterAuction(demand)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'buyer' && (
          selectedRFQ ? (
            <RFQDetailView
              rfq={selectedRFQ}
              onBack={handleBackToRFQs}
              onEnterAuction={handleEnterAuction}
              onOrderCreated={handleOrderCreated}
            />
          ) : (
            <BuyerDashboard
              onViewRFQ={handleViewRFQ}
              onEnterAuction={handleEnterAuction}
            />
          )
        )}

        {activeTab === 'supplier' && (
          <SupplierMarket
            onEnterAuction={handleEnterAuction}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView />
        )}
      </main>

      {/* Live Auction Modal (Can open from any view) */}
      <LiveAuctionModal
        isOpen={!!auctionRFQ}
        onClose={() => setAuctionRFQ(null)}
        rfq={auctionRFQ}
      />

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white/70 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-800">ReverseMarket B2B</span>
            <span>•</span>
            <span>Smart Demand-Driven Reverse Procurement</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Escrow powered by ICICI Nodal • Multi-Criteria AI Matching • Real-time WebSockets
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
