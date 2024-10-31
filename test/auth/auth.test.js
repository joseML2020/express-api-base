/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user.model');

describe('Auth API', () => {
    const testUser = {
        name: 'Test User',
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
        bio: 'This is a test user',
    };

    let activationCode;

    beforeAll(async () => {
        const createUserResponse = await request(app)
            .post('/api/users')
            .send(testUser);
        
        activationCode = createUserResponse.body.activationCode;
    });

    test('El usuario debe activarse correctamente', async () => {
        const response = await request(app)
            .get(`/api/users/activate/${activationCode}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User activated successfully');

        const user = await User.findOne({ email: testUser.email });
        expect(user).toBeDefined();
        expect(user.active).toBe(true);
    });

    test('Debe permitir el inicio de sesión con credenciales válidas', async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
        expect(typeof loginResponse.body.token).toBe('string');
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

    test('No debe permitir el inicio de sesión con cuenta no activada', async () => {
        const inactiveUser = {
            name: 'Inactive User',
            email: 'inactiveuser@example.com',
            password: 'testpassword',
            bio: 'This is an inactive user',
        };

        await request(app)
            .post('/api/users')
            .send(inactiveUser);

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: inactiveUser.email,
                password: inactiveUser.password,
            });

        expect(loginResponse.status).toBe(403);
        expect(loginResponse.body).toHaveProperty('error', 'User not activated');
    });
});
