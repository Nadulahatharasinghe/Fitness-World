import express from 'express';
import {
  register,
  login,
  logout,
  verifyTwoFactor,
  getCurrentUser,
  enableTwoFactor,
  disableTwoFactor,
  requestPasswordReset,
  resetPasswordWithOtp,
  googleLogin,
  facebookLogin
} from '../../controllers/Admin/authController.js';
import { auth } from '../../middleware/Auth.js';

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-2fa', verifyTwoFactor);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPasswordWithOtp);

// Social login placeholders
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);

// ── Protected routes ──────────────────────────────────────────────────────────
router.get('/me', auth, getCurrentUser);
router.post('/enable-2fa', auth, enableTwoFactor);
router.post('/disable-2fa', auth, disableTwoFactor);

export default router;
