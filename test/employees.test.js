const request = require('supertest');
const app = require('../app'); // Asegúrate de que la ruta a tu app sea correcta
const employees = require('../models/employees.json');

describe('Employee API', () => {
    
    // Test para obtener todos los empleados
    test('GET /api/employees/all should return all employees', async () => {
      const response = await request(app).get('/api/employees/all');
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true); // Check if the response body is an array
      expect(response.body.length).toBe(employees.length); // Check that the length matches the employees data
  });

    // Test para obtener empleados paginados
    test('GET /api/employees?page=1 should return first two employees', async () => {
      const response = await request(app).get('/api/employees?page=1');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);        
      expect(response.body.length).toBe(2);                 
  });

    test('GET /api/employees?page=2 should return second two employees', async () => {
        const response = await request(app).get('/api/employees?page=2');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);  
    });

    // Test para obtener el empleado más viejo
    test('GET /api/employees/oldest should return the oldest employee', async () => {
      const response = await request(app).get('/api/employees/oldest');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toEqual(employees.reduce((prev, current) => (prev.age > current.age) ? prev : current)); // Check if it equals the oldest employee
  });

    // Test para obtener empleados con privilegios 'user'
    test('GET /api/employees/users should return only employees with privileges user', async () => {
        const response = await request(app).get('/api/employees/users');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(emp => {
            expect(emp).toHaveProperty('privileges');
            expect(emp.privileges).toBe('user');
        });
    });

    // Test para agregar un nuevo empleado
    test('POST /api/employees should add a new employee', async () => {
      const newEmployee = { name: 'Alice', age: 28, phone: '1234567890', privileges: 'user', badges: ['green'] };
      const initialLength = employees.length;
      const response = await request(app).post('/api/employees').send(newEmployee);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Alice');
      expect(employees.length).toBe(initialLength + 1);
  });

    // Test para obtener un empleado por nombre
    test('GET /api/employees/:name should return the employee with given name', async () => {
        const response = await request(app).get('/api/employees/Alice');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name', 'Alice');
    });

    test('GET /api/employees/Unknown should return 404 if employee not found', async () => {
        const response = await request(app).get('/api/employees/Unknown');
        expect(response.statusCode).toBe(404);
        expect(response.body.code).toBe('not_found');
    });

    // Test para obtener empleados por badges
    test('GET /api/employees/by-badges?badges=black should return employees with black badges', async () => {
        const response = await request(app).get('/api/employees/by-badges?badges=black');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(emp => {
            expect(emp.badges).toContain('black');
        });
    });

    test('GET /api/employees/by-badges?badges=asdad should return 404 if no employees found', async () => {
        const response = await request(app).get('/api/employees/by-badges?badges=asdad');
        expect(response.statusCode).toBe(404);
        expect(response.body.code).toBe( 'bad_request');
    });
});
