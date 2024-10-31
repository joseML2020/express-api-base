const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('', userController.createUser);
router.get('/activate/:activationCode', userController.activateUser);
router.post('/reset/code', userController.resetActivateCodeUser);

module.exports = router;