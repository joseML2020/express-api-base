var express = require('express');
const router = express.Router();
const employeeRoutes = require('./employee.route');
const postRoutes = require('./post.route');

router.use('/posts', postRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;
