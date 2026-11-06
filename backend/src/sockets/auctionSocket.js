export const setupAuctionSockets = (io) => {
  io.on('connection', (socket) => {
    // Join an individual auction room
    socket.on('join_auction', (rfqId) => {
      socket.join(`rfq_${rfqId}`);
      socket.emit('joined_room', {
        status: 'active',
        room: `rfq_${rfqId}`
      });
    });

    socket.on('leave_auction', (rfqId) => {
      socket.leave(`rfq_${rfqId}`);
    });

    // Broadcast new buyer demand to all sellers immediately
    socket.on('create_rfq', (rfqData) => {
      io.emit('new_rfq', rfqData);
      io.emit('new_rfq_alert', rfqData);
    });

    // Real-time bids inside the reverse auction room
    socket.on('submit_bid', (data) => {
      if (data?.rfqId) {
        io.to(`rfq_${data.rfqId}`).emit('bid_update', data.bid);
      }
      io.emit('bid_update', data.bid);
    });
  });
};
