import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// Play pleasant double-tone notification chime using Web Audio API
export const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // First note (F5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, ctx.currentTime);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.25);

    // Second note (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // Non-blocking if audio autoplay policy blocks before user interaction
  }
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [incomingDemand, setIncomingDemand] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 'demo_notif_1',
      title: '5,000 N95 Medical Grade Masks',
      buyer: 'Tata Healthcare',
      budget: 70000,
      time: '10m ago',
      read: false
    },
    {
      id: 'demo_notif_2',
      title: '250 Ergonomic Mesh Office Chairs',
      buyer: 'Infosys Facilities',
      budget: 800000,
      time: '35m ago',
      read: false
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    const backendUrl = window.location.origin.includes('localhost:3000')
      ? 'http://localhost:5000'
      : window.location.origin;

    const s = io(backendUrl, {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
    });

    s.on('connect', () => {
      console.log('Socket connected to backend engine:', s.id);
    });

    const handleNewDemand = (data) => {
      if (!data) return;
      console.log('Real-Time RFQ Broadcast Received:', data);

      // Play audio chime
      playNotificationChime();

      // Show toast
      setIncomingDemand(data);

      // Add to notifications list
      const newNotif = {
        id: data._id || data.id || 'notif_' + Date.now(),
        title: data.title || 'New Buyer Demand',
        buyer: data.company || data.buyerName || 'Corporate Buyer',
        budget: data.targetBudget || data.targetPrice || 50000,
        time: 'Just now',
        read: false,
        raw: data
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Auto dismiss pop-up toast after 9 seconds
      setTimeout(() => {
        setIncomingDemand((curr) => (curr && (curr._id === data._id || curr.id === data.id) ? null : curr));
      }, 9000);
    };

    s.on('new_rfq', handleNewDemand);
    s.on('new_rfq_alert', handleNewDemand);

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const clearDemand = () => setIncomingDemand(null);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        incomingDemand,
        notifications,
        unreadCount,
        clearDemand,
        markAllRead,
        playChime: playNotificationChime
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
