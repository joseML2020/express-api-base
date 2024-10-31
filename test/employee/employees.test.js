/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const employees = require('../../models/employees.json');
const User = require('../../models/user.model');

describe('Employee API', () => {
    let token; 

    beforeAll(async () => {
        const allUsers = await User.find({});
        console.log('Usuarios actuales en la base de datos:', allUsers);
        console.log('Login')
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'testpassword' }); 
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
        token = loginResponse.body.token; 
        console.log(`Toke: ${token}`)
    });

    // Test para obtener todos los empleados
    test('GET /api/employees/all should return all employees', async () => {
        const response = await request(app)
            .get('/api/employees/all')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(employees.length);
        console.log(`Toke: ${token}`)
    });

    // Test para obtener empleados paginados
    test('GET /api/employees?page=1 should return first two employees', async () => {
        const response = await request(app)
            .get('/api/employees?page=1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
    });

    test('GET /api/employees?page=2 should return second two employees', async () => {
        const response = await request(app)
            .get('/api/employees?page=2')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
    });

    // Test para obtener el empleado más viejo
    test('GET /api/employees/oldest should return the oldest employee', async () => {
        const response = await request(app)
            .get('/api/employees/oldest')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toEqual(employees.reduce((prev, current) => (prev.age > current.age) ? prev : current));
    });

    // Test para obtener empleados con privilegios 'user'
    test('GET /api/employees/users should return only employees with privileges user', async () => {
        const response = await request(app)
            .get('/api/employees/users')
            .set('Authorization', `Bearer ${token}`);

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

        const response = await request(app)
            .post('/api/employees')
            .set('Authorization', `Bearer ${token}`) 
            .send(newEmployee);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('name', 'Alice');
        expect(employees.length).toBe(initialLength + 1);
    });

    // Test para obtener un empleado por nombre
    test('GET /api/employees/:name should return the employee with given name', async () => {
        const response = await request(app)
            .get('/api/employees/Alice')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name', 'Alice');
    });

    test('GET /api/employees/Unknown should return 404 if employee not found', async () => {
        const response = await request(app)
            .get('/api/employees/Unknown')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.code).toBe('not_found');
    });

    // Test para obtener empleados por badges
    test('GET /api/employees/by-badges?badges=black should return employees with black badges', async () => {
        const response = await request(app)
            .get('/api/employees/by-badges?badges=black')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(emp => {
            expect(emp.badges).toContain('black');
        });
    });

    test('GET /api/employees/by-badges?badges=asdad should return 404 if no employees found', async () => {
        const response = await request(app)
            .get('/api/employees/by-badges?badges=asdad')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.code).toBe('bad_request');
    });
});
