import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res,) => {
    console.log('Register request body:', req.body);
    try {
        const { name, email, password } = req.body;

        console.log('Extracted fields:', { name, email, password: password ? 'provided' : 'missing' })

        if (!name || !email || !password) {
            
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });

        console.log('User exists check:', userExists ? 'yes' : 'no');

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        // Token generate
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-very-long-and-random',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
    console.error('REGISTER ERROR DETAILS:', error.message);
    console.error('Full error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Server error in registration', 
      error: error.message 
    });
  }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-very-long-and-random',
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error is ' + error.message });
    }
};


export default { register , login };