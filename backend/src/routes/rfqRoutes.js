import express from 'express';
import { parsePromptWithAI, createRFQ, getRFQs, getRFQById } from '../controllers/rfqController.js';

const router = express.Router();

router.post('/ai-parse', parsePromptWithAI);
router.post('/', createRFQ);
router.get('/', getRFQs);
router.get('/:id', getRFQById);

export default router;
