import express from 'express';
import { placeBid, getBidsForRFQ, acceptBid } from '../controllers/bidController.js';

const router = express.Router();

router.post('/', placeBid);
router.get('/rfq/:rfqId', getBidsForRFQ);
router.post('/accept', acceptBid);

export default router;
