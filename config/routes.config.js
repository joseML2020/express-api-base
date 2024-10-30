const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');

// Ruta para obtener todos los empleados
router.get('/employees/all', employeesController.getAllEmployees);

// Ruta para empleados paginados
router.get('/employees', employeesController.getPaginatedEmployees);

// Ruta para obtener el empleado más viejo
router.get('/employees/oldest', employeesController.getOldestEmployee);

// Ruta para obtener empleados con privilegios 'user'
router.get('/employees/users', employeesController.getUsers);

// Ruta para obtener empleados por badges
router.get('/employees/by-badges', employeesController.getEmployeesByBadges);

// Ruta para agregar un nuevo empleado
router.post('/employees', employeesController.addEmployee);

// Ruta para obtener un empleado por nombre
router.get('/employees/:name', employeesController.getEmployeeByName);

module.exports = router;
