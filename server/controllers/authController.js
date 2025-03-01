exports.registerUser = async (req, res) => {
    try {
        // Access data from request body
        const { email, username, password } = req.body;

        // Validate required fields
        if (!email || !username || !password) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password
        });

        // Save to database
        await newUser.save();

        res.status(201).json({ 
            success: true, 
            email: newUser.email 
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};
