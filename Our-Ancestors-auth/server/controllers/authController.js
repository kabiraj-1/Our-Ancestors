import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ name, email, password: hashed, otp, otpExpires });

    await transporter.sendMail({
      from: `"Our Ancestors" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your verification OTP',
      text: `Your OTP code is: ${otp}. It expires in 10 minutes.`
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (user.isVerified) return res.status(400).json({ msg: 'Already verified' });
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ msg: 'Verified', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Incorrect password' });
    if (!user.isVerified) return res.status(400).json({ msg: 'Email not verified' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
