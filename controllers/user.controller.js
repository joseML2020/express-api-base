const User = require('../models/user.model');
const crypto = require('crypto');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;

        const activationCode = crypto.randomBytes(8).toString('hex');

        const newUser = new User({ name, email, password, bio, active: false, activationCode });
        await newUser.save();

        return res.status(201).json({ 
            message: `User created successfully. Please activate your account. Code activated:${activationCode}`, 
            activationCode 
        });
        } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
};

exports.activateUser = async (req, res) => {
    const { activationCode } = req.params;

    try {
        const user = await User.findOne({activationCode});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.active = true;
        user.activationCode = undefined;
        await user.save();

        return res.status(200).json({ message: 'User account activated successfully' });
    } catch (error) {
        console.error('Error activating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.resetActivateCodeUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Password error' });
        }
        const newActivationCode = crypto.randomBytes(16).toString('hex');
        user.activationCode = newActivationCode;
        await user.save();

        return res.status(200).json({ message: 'Activation code successfully reset', activationCode: newActivationCode });
    } catch (error) {
        return res.status(500).json({ message: 'Error', error: error.message });
    }
};
