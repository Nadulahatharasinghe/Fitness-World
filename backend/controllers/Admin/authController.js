import User from '../../models/Admin/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'fitness_world_dev_secret';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Temp token for 2FA step (10 min)
const generateTempToken = (userId) => {
  return jwt.sign({ userId, twofa: true }, JWT_SECRET, { expiresIn: '10m' });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Email transporter — only created when SMTP credentials exist
const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
  }
  return null;
};

const sendMail = async (to, subject, html) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(`[DEV] No SMTP configured. Email to ${to}: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@fitnessworld.com',
      to, subject, html
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, phoneNumber } = req.body;

    if (!username || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username)
        return res.status(400).json({ message: 'Username already taken.' });
      if (existingUser.email === email.toLowerCase())
        return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = new User({ username, firstName, lastName, email, password, phoneNumber });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ message: 'Registration successful! Welcome to Fitness World.', user: user.getProfile(), token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username/email and password are required.' });

    const user = await User.findOne({ $or: [{ username }, { email: username }] }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    if (!user.isActive) return res.status(401).json({ message: 'Account is deactivated. Contact support.' });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials.' });

    // 2FA check
    if (user.twoFactorEnabled) {
      const otp = generateOtp();
      user.twoFactorOtp = otp;
      user.twoFactorOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendMail(user.email, 'Fitness World — 2FA Code',
        `<p>Your 2FA code is <b>${otp}</b>. Valid for 10 minutes.</p>`);
      if (process.env.SHOW_OTPS === 'true') console.log(`[DEV] 2FA OTP for ${user.email}: ${otp}`);
      const tempToken = generateTempToken(user._id);
      return res.json({ message: '2FA code sent to your email.', twofaRequired: true, tempToken });
    }

    const token = generateToken(user._id);
    res.json({ message: 'Login successful! Welcome back.', user: user.getProfile(), token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

// ─── Get Current User ────────────────────────────────────────────────────────
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: user.getProfile() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user.', error: error.message });
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully.' });
};

// ─── Forgot Password (OTP) ───────────────────────────────────────────────────
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetOtp +resetOtpExpiresAt');
    if (!user) return res.json({ message: 'If that email exists, an OTP has been sent.' });

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendMail(user.email, 'Fitness World — Password Reset OTP',
      `<h2>Password Reset</h2><p>Your OTP is <b style="font-size:24px">${otp}</b></p><p>Valid for 10 minutes. Do not share this code.</p>`);

    if (process.env.SHOW_OTPS === 'true') console.log(`[DEV] Reset OTP for ${user.email}: ${otp}`);
    res.json({ message: 'If that email exists, an OTP has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error sending OTP.', error: error.message });
  }
};

// ─── Reset Password with OTP ─────────────────────────────────────────────────
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP, and new password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetOtp +resetOtpExpiresAt +password');
    if (!user || !user.resetOtp || !user.resetOtpExpiresAt)
      return res.status(400).json({ message: 'Invalid or expired OTP.' });

    if (user.resetOtp !== otp || user.resetOtpExpiresAt < new Date())
      return res.status(400).json({ message: 'Invalid or expired OTP.' });

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password.', error: error.message });
  }
};

// ─── Verify 2FA OTP ──────────────────────────────────────────────────────────
export const verifyTwoFactor = async (req, res) => {
  try {
    const { tempToken, otp } = req.body;
    if (!tempToken || !otp) return res.status(400).json({ message: 'tempToken and otp required.' });

    let payload;
    try { payload = jwt.verify(tempToken, JWT_SECRET); }
    catch { return res.status(401).json({ message: 'Invalid or expired temp token.' }); }

    if (!payload.twofa) return res.status(401).json({ message: 'Invalid temp token.' });

    const user = await User.findById(payload.userId).select('+twoFactorOtp +twoFactorOtpExpiresAt');
    if (!user || !user.twoFactorEnabled) return res.status(400).json({ message: '2FA not enabled.' });
    if (!user.twoFactorOtp || user.twoFactorOtp !== otp || user.twoFactorOtpExpiresAt < new Date())
      return res.status(400).json({ message: 'Invalid or expired 2FA code.' });

    user.twoFactorOtp = undefined;
    user.twoFactorOtpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id);
    return res.json({ message: '2FA verified.', user: user.getProfile(), token });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying 2FA.', error: error.message });
  }
};

// ─── Enable / Disable 2FA ────────────────────────────────────────────────────
export const enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.twoFactorEnabled = true;
    await user.save();
    res.json({ message: '2FA enabled.', twoFactorEnabled: true });
  } catch (error) {
    res.status(500).json({ message: 'Error enabling 2FA.', error: error.message });
  }
};

export const disableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('+twoFactorOtp +twoFactorOtpExpiresAt');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.twoFactorEnabled = false;
    user.twoFactorOtp = undefined;
    user.twoFactorOtpExpiresAt = undefined;
    await user.save();
    res.json({ message: '2FA disabled.', twoFactorEnabled: false });
  } catch (error) {
    res.status(500).json({ message: 'Error disabling 2FA.', error: error.message });
  }
};

// ─── Social Login Placeholders ───────────────────────────────────────────────
export const googleLogin = async (req, res) => {
  try {
    const { googleToken, profile } = req.body;
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(501).json({ message: 'Google OAuth not configured. Add GOOGLE_CLIENT_ID to .env.' });
    }
    // TODO: verify googleToken with Google API using GOOGLE_CLIENT_ID
    // For now, return placeholder
    res.status(501).json({ message: 'Google login integration pending. Configure GOOGLE_CLIENT_ID.' });
  } catch (error) {
    res.status(500).json({ message: 'Google login error.', error: error.message });
  }
};

export const facebookLogin = async (req, res) => {
  try {
    if (!process.env.FACEBOOK_APP_ID) {
      return res.status(501).json({ message: 'Facebook OAuth not configured. Add FACEBOOK_APP_ID to .env.' });
    }
    res.status(501).json({ message: 'Facebook login integration pending. Configure FACEBOOK_APP_ID.' });
  } catch (error) {
    res.status(500).json({ message: 'Facebook login error.', error: error.message });
  }
};
