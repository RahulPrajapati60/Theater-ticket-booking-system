import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { register, login } from '../Controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);



router.put('/profile', protect, async (req, res) => {
    try {
        console.log('Profile update - user:', req.user);

        const { name, password } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Name update
        if (name) {
            user.name = name;
        }

        // Password update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message  });
    }
});


export default router;