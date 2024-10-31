/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app'); // Asegúrate de que la ruta a tu app sea correcta
const mongoose = require('mongoose');

describe('Auth API', () => {
    const testUser = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword',
        bio: 'This is a test user',
    };

    beforeAll(async () => {
        await request(app)
            .post('/api/users')
            .send(testUser);
    });

    test('Debe permitir el inicio de sesión con credenciales válidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token'); 
        expect(typeof response.body.token).toBe('string');
    });

    test('Debe rechazar el inicio de sesión con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'incorrectpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    test('Las rutas protegidas deben requerir autenticación', async () => {
        // Intentar acceder a una ruta protegida sin token
        const response = await request(app)
            .get('/api/posts') // Asegúrate de que esta ruta esté protegida
            .set('Authorization', 'Bearer '); // Token vacío

        expect(response.status).toBe(401); // Debería devolver 401 Unauthorized

        // Intentar acceder a la misma ruta con un token inválido
        const invalidTokenResponse = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer invalidtoken');

        expect(invalidTokenResponse.status).toBe(401); // Debería devolver 401 Unauthorized
    });

    test('Las rutas protegidas deben permitir el acceso con un token válido', async () => {
        // Obtener un token válido
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        const token = loginResponse.body.token; // Obtener el token

        const protectedResponse = await request(app)
            .get('/api/posts') // Asegúrate de que esta ruta esté protegida
            .set('Authorization', `Bearer ${token}`);

        expect(protectedResponse.status).toBe(200); // Debería devolver 200 OK
        // Aquí puedes agregar más verificaciones para asegurarte de que la respuesta tenga el contenido esperado
    });
});
