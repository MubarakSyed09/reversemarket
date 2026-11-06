import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isFallbackActive } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import rfqRoutes from './routes/rfqRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { setupAuctionSockets } from './sockets/auctionSocket.js';
import { seedInitialData } from '../seed.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../frontend/dist');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(express.json());

const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
app.set('io', io);
setupAuctionSockets(io);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    engine: 'ReverseMarket ProcureX Engine v1.0',
    database: isFallbackActive() ? 'In-Memory Fallback' : 'MongoDB Connected'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/orders', orderRoutes);

// Serve compiled frontend production build directly
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ReverseMarket Engine running on http://localhost:${PORT}`);
    console.log(`📡 WebSockets Active on ws://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
};

startServer();
