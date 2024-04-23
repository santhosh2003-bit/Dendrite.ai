const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// SignUp route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if(!username || !email || !password){
            return res.status(500).json({error:"Fill All Field"})
        }
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save().then(()=>{

            return res.status(201).json({message:'User created successfully'});
        }).catch((err)=>{
            return res.status(500).json({error:"error occured"})
        })
    } catch (error) {
        console.error('Signup Error:', error);
       return res.status(500).json({ error: error.message });
    }
});
// SignIn route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!email || !password){
            return res.json({error:"Fill All Fields"})
        }
        if (!user) {
            return res.status(404).json({error:'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({error:'Invalid credentials'});
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.json({ token });
      
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'A user with this username or email already exists.' });
        }
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Internal server error' });
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
