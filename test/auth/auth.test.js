/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');

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
        const response = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer ');

        expect(response.status).toBe(401); 


        const invalidTokenResponse = await request(app)
            .get('/api/posts')
            .set('Authorization', 'Bearer invalidtoken');

        expect(invalidTokenResponse.status).toBe(401);
    });

    test('Las rutas protegidas deben permitir el acceso con un token válido', async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        const token = loginResponse.body.token;

        const protectedResponse = await request(app)
            .get('/api/posts') 
            .set('Authorization', `Bearer ${token}`);

        expect(protectedResponse.status).toBe(200); 
    });
});
