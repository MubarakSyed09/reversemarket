import express from 'express';
import { getOrders, createOrder, updateOrderStatus, payAdvance, payFinal } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/pay-advance', payAdvance);
router.post('/:id/pay-final', payFinal);

export default router;
