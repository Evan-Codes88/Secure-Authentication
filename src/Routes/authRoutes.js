import express from 'express';

import { signup, login, logout, verifyEmail, setup2FA, verify2FACode, } from '../Controllers/authControllers.js';
import { isAuthenticated } from '../Utils/utils.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post('/2fa/setup', isAuthenticated, setup2FA);
router.post('/2fa/verify', isAuthenticated, verify2FACode);

export default router;