const express = require('express');
const router = express.Router();
const employeesCont = require('../controllers/employee.controller');
const authController = require('../controllers/auth/auth.controller');
router.use(authController.authenticate);

router.get('/all', employeesCont.getAllEmployees);
router.get('/', employeesCont.getPaginatedEmployees);
router.get('/oldest', employeesCont.getOldestEmployee);
router.get('/users', employeesCont.getUsers);
router.get('/by-badges', employeesCont.getEmployeesByBadges);
router.post('/', employeesCont.addEmployee);
router.get('/:name', employeesCont.getEmployeeByName);

module.exports = router;
