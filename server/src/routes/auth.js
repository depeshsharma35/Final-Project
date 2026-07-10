import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import LoginHistory from '../models/LoginHistory.js';
import { sendOTP } from '../utils/sendOTP.js';

const router = express.Router();

// Helper to check if OTP is needed (kept for reference or custom rules)
function checkNeedOtp(user, location = {}, device = {}) {
  const reasons = [];
  const settings = user.securitySettings || { locationCheck: true, deviceCheck: true };

  if (settings.locationCheck) {
    if (user.lastCity && location.city && user.lastCity.toLowerCase() !== location.city.toLowerCase()) {
      reasons.push(`New city detected: ${location.city} (previous: ${user.lastCity})`);
    }
    if (user.lastState && location.state && user.lastState.toLowerCase() !== location.state.toLowerCase()) {
      reasons.push(`New state detected: ${location.state} (previous: ${user.lastState})`);
    }
  }

  if (settings.deviceCheck) {
    if (user.lastDeviceFingerprint && device.fingerprint && user.lastDeviceFingerprint !== device.fingerprint) {
      reasons.push(`New device detected: ${device.os} — ${device.browser}`);
    }
  }

  if (!user.lastCity && !user.lastDeviceFingerprint) {
    reasons.push('First-time login from this account');
  }

  if (reasons.length > 0) {
    return { needed: true, reason: reasons.join('. ') + '.' };
  }
  return { needed: false, reason: '' };
}

// POST /api/auth/signup - First time sign up triggers OTP verification sent to email/phone
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone = '', otpMethod = 'email', location = {}, device = {} } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and password required' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Account already exists. Please sign in.' });
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    await Otp.create({
      email: email.trim().toLowerCase(),
      otp: otpCode,
      reason: 'Account verification for new sign up.'
    });

    // Send verification code to registered email & phone (Never log to console/terminal)
    try {
      await sendOTP(email.trim().toLowerCase(), otpCode, name);
    } catch (emailError) {
      // If email sending fails, delete the OTP record so user can retry cleanly
      await Otp.deleteMany({ email: email.trim().toLowerCase(), otp: otpCode });
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP verification email. Please verify your email configuration or try again later.',
        error: emailError.message
      });
    }

    return res.json({
      status: 'otp_required',
      isSignup: true,
      email: email.trim().toLowerCase(),
      user: {
        name,
        email: email.trim().toLowerCase(),
        password,
        phone,
        otpMethod,
        avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 30 + 1)}`
      },
      reason: 'A 6-digit verification code has been sent to your registered email and phone number.'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// POST /api/auth/login - Direct sign in without OTP
router.post('/login', async (req, res) => {
  try {
    const { email, password, location = {}, device = {} } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Direct login without OTP (user details were verified during signup)
    user.lastCity = location.city || user.lastCity;
    user.lastState = location.state || user.lastState;
    user.lastDeviceFingerprint = device.fingerprint || user.lastDeviceFingerprint;
    user.lastDeviceName = device.full || user.lastDeviceName;
    user.lastLoginTime = new Date();
    await user.save();

    await LoginHistory.create({
      email: user.email,
      time: new Date().toISOString(),
      city: location.city || 'Unknown',
      state: location.state || 'Unknown',
      country: location.country || 'Unknown Region',
      device: device.full || 'Unknown Device',
      browser: device.browser || 'Unknown Browser',
      os: device.os || 'Unknown OS',
      otpVerified: false,
      themeAtLogin: user.themePreference || 'dark'
    });

    return res.json({
      status: 'success',
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        otpMethod: user.otpMethod || 'email',
        securitySettings: user.securitySettings,
        themePreference: user.themePreference
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// POST /api/auth/verify-otp - Handles verification for signup
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, location = {}, device = {}, isSignup = false, signupData = null } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ status: 'error', message: 'Email and OTP required' });
    }

    const otpRecords = await Otp.find({ email: email.trim().toLowerCase() }).sort({ createdAt: -1 });
    if (!otpRecords || otpRecords.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Incorrect or expired OTP' });
    }

    const now = new Date();
    let matchedRecord = null;
    const hashedInput = crypto.createHash('sha256').update(otp).digest('hex');

    for (const record of otpRecords) {
      const recordAge = now.getTime() - new Date(record.createdAt).getTime();
      if (recordAge > 5 * 60 * 1000 || (record.expiresAt && now > new Date(record.expiresAt))) {
        continue;
      }
      if (record.otp === hashedInput || record.otp === otp) {
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord) {
      return res.status(400).json({ status: 'error', message: 'Incorrect or expired OTP' });
    }

    // Remove OTP record(s) after successful verification
    await Otp.deleteMany({ email: email.trim().toLowerCase() });

    let user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      if (isSignup && signupData) {
        user = await User.create({
          email: email.trim().toLowerCase(),
          name: signupData.name,
          password: signupData.password,
          phone: signupData.phone || '',
          otpMethod: signupData.otpMethod || 'email',
          avatar: signupData.avatar || `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 30 + 1)}`,
          securitySettings: { locationCheck: true, deviceCheck: true },
          themePreference: 'dark',
          lastCity: location.city || 'Unknown',
          lastState: location.state || 'Unknown',
          lastDeviceFingerprint: device.fingerprint || '',
          lastDeviceName: device.full || '',
          lastLoginTime: new Date()
        });
      } else {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } else {
      user.lastCity = location.city || user.lastCity;
      user.lastState = location.state || user.lastState;
      user.lastDeviceFingerprint = device.fingerprint || user.lastDeviceFingerprint;
      user.lastDeviceName = device.full || user.lastDeviceName;
      user.lastLoginTime = new Date();
      await user.save();
    }

    await LoginHistory.create({
      email: user.email,
      time: new Date().toISOString(),
      city: location.city || 'Unknown',
      state: location.state || 'Unknown',
      country: location.country || 'Unknown Region',
      device: device.full || 'Unknown Device',
      browser: device.browser || 'Unknown Browser',
      os: device.os || 'Unknown OS',
      otpVerified: true,
      themeAtLogin: user.themePreference || 'dark'
    });

    return res.json({
      status: 'success',
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        otpMethod: user.otpMethod,
        securitySettings: user.securitySettings,
        themePreference: user.themePreference
      }
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email required' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const destEmail = user ? user.email : email.trim().toLowerCase();
    const destPhone = user ? user.phone : (req.body.phone || '');
    const destMethod = user ? user.otpMethod : (req.body.otpMethod || 'email');

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    await Otp.create({
      email: destEmail,
      otp: otpCode,
      reason: 'Resended OTP verification'
    });

    // Resend verification code to registered email & phone (Never log to console/terminal)
    try {
      await sendOTP(destEmail, otpCode, user ? user.name : 'User');
    } catch (emailError) {
      await Otp.deleteMany({ email: destEmail, otp: otpCode });
      return res.status(500).json({
        status: 'error',
        message: 'Failed to resend OTP verification email. Please check your email configuration or try again later.',
        error: emailError.message
      });
    }

    res.json({ status: 'success', message: `OTP resent to registered ${destMethod === 'sms' ? 'mobile number' : 'email'}` });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// GET /api/auth/profile/:email
router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    res.json({ status: 'success', profile: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// PUT /api/auth/profile/:email
router.put('/profile/:email', async (req, res) => {
  try {
    const { name, phone, otpMethod, securitySettings, themePreference } = req.body;
    const user = await User.findOne({ email: req.params.email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (otpMethod !== undefined) user.otpMethod = otpMethod;
    if (securitySettings !== undefined) user.securitySettings = securitySettings;
    if (themePreference !== undefined) user.themePreference = themePreference;

    await user.save();
    res.json({ status: 'success', profile: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// GET /api/auth/history/:email
router.get('/history/:email', async (req, res) => {
  try {
    const history = await LoginHistory.find({ email: req.params.email.trim().toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ status: 'success', history });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// POST /api/auth/history/:email
router.post('/history/:email', async (req, res) => {
  try {
    const entry = req.body;
    await LoginHistory.create({
      email: req.params.email.trim().toLowerCase(),
      ...entry
    });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
