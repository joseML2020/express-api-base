/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { disconnectDB } = require('../config/db.config');

describe('POST /api/posts', () => {
    afterEach(async () => {
        const allPosts = await mongoose.connection.collection('posts').find({}).toArray();
        console.log('Todos los posts antes de eliminar:');
        console.log(allPosts);
        await mongoose.connection.collection('posts').deleteMany({});
    });

    afterAll(async () => {
        await disconnectDB();
    });

    test('Debe crear un nuevo post y responder con 201', async () => {
        const newPost = {
            title: 'Título de prueba',
            text: 'Texto de prueba con más de cinco caracteres',
            author: 'Autor de prueba',
        };
        const response = await request(app)
            .post('/api/posts')
            .send(newPost);
        console.log("Respuesta de la API:", response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('title', newPost.title);
        expect(response.body).toHaveProperty('text', newPost.text);
        expect(response.body).toHaveProperty('author', newPost.author);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('createdAt'); // Ahora debería estar presente
        expect(response.body).toHaveProperty('updatedAt'); // Ahora debería estar presente
    });

    test('Debe responder con 400 si los datos no son válidos', async () => {
        const invalidPost = {
            title: 'Titu',
            text: '',
            author: '',
        };
        const response = await request(app)
            .post('/api/posts')
            .send(invalidPost);
        console.log("Respuesta de la API con datos no válidos:", response.body);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});

