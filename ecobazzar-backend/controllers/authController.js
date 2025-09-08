const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, first_name, last_name, email, password, role_id } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            first_name,
            last_name,
            email,
            password_hash: hashedPassword, // The key must be 'password_hash'
            role_id
        };

        const userId = await User.create(newUser);
        const token = jwt.sign({ userId, email, roleId: role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', userId, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // --- FIX: Add a check for missing email or password ---
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    // --- END OF FIX ---

    try {
        // Check if the user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT
        const token = jwt.sign(
            { userId: user.user_id, roleId: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                roleId: user.role_id,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};