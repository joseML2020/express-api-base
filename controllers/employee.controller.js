const employees = require('../models/employees.json');
exports.getAllEmployees = (req, res) => {
    res.json(employees);
};
exports.getPaginatedEmployees = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedEmployees = employees.slice(startIndex, endIndex);
    res.json(paginatedEmployees);
};
exports.getOldestEmployee = (req, res) => {
    const oldest = employees.reduce((prev, current) => (prev.age > current.age) ? prev : current);
    res.json(oldest);
};
exports.getUsers = (req, res) => {
    const users = employees.filter(employee => employee.privileges === 'user');
    res.json(users);
};
exports.addEmployee = (req, res) => {
    const newEmployee = req.body;
        if (!newEmployee.name || !newEmployee.age || !newEmployee.phone || !newEmployee.privileges) {
        return res.status(400).json({ code: 'bad_request' });
    }
    
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
};
exports.getEmployeeByName = (req, res) => {
    const name = req.params.name;
    const employee = employees.find(e => e.name.toLowerCase() === name.toLowerCase());
    
    if (!employee) {
        return res.status(404).json({ code: 'not_found' });
    }
    
    res.json(employee);
};
exports.getEmployeesByBadges = (req, res)=>{
    const badge = req.query.badges;
    const filteredEmployees = employees.filter(emp=>emp.badges.includes(badge));
    if (filteredEmployees.length === 0) {
        return res.status(404).json({ code: 'bad_request' });
    }
    res.json(filteredEmployees);
  };
  
  