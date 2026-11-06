import express from 'express';
import { register, login, googleLogin, getDemoAccounts } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/demo-accounts', getDemoAccounts);

export default router;
