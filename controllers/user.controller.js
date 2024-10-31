const User = require('../models/user.model');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;

        const newUser = new User({ name, email, password, bio });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
};
