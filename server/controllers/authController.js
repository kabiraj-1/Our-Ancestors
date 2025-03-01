const User = require('../models/User');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Save user to database with OTP
        const user = new User({
            username,
            email,
            password,
            otp,
            otpExpiry: Date.now() + 300000 // 5 minutes
        });
        
        await user.save();

        // Send OTP email
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Your Verification OTP',
            html: `<p>Your OTP is: <strong>${otp}</strong></p>`
        });

        res.json({ success: true, email });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();
        
        res.json({ success: true, token });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate new OTP
        const newOTP = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        // Update OTP and expiry
        user.otp = newOTP;
        user.otpExpiry = Date.now() + 300000;
        await user.save();

        // Resend email
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Your New Verification OTP',
            html: `<p>Your new OTP is: <strong>${newOTP}</strong></p>`
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
