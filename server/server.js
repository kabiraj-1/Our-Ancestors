// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Temporary storage for verification codes
const verificationCodes = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        // Generate 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000);
        const verificationCode = code.toString();
        
        // Store code with expiration (10 minutes)
        verificationCodes.set(req.body.email, {
            code: verificationCode,
            expires: Date.now() + 600000
        });

        // Send verification email
        await transporter.sendMail({
            from: 'Your App <yourapp@gmail.com>',
            to: req.body.email,
            subject: 'Email Verification Code',
            text: `Your verification code is: ${verificationCode}`
        });

        res.status(200).json({ 
            message: 'Verification code sent',
            email: req.body.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending verification email' });
    }
});

// Verification endpoint
app.post('/api/auth/verify', (req, res) => {
    const { email, code } = req.body;
    const storedCode = verificationCodes.get(email);

    if (!storedCode || storedCode.expires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (storedCode.code === code) {
        verificationCodes.delete(email);
        // Create user in database here
        const token = generateAuthToken(); // Implement JWT generation
        return res.json({ token });
    }

    res.status(400).json({ message: 'Invalid verification code' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
