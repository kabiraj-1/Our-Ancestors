const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Password reset token generator
const generateResetToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Forgot password handler
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate reset token
        const resetToken = generateResetToken(user._id);
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send reset email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reset password handler
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 8);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};