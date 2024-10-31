var express = require('express');
const router = express.Router();
const employeeRoutes = require('./employee.route');
const postRoutes = require('./post.route');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;
