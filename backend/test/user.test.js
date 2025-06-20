const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');

describe('User API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await mongoose.connection.close();
    });

    const userData = {
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'TestPass123'
    };

    it('register user', async () => {
        const res = await request(app)
            .post('/users')
            .send(userData)
            .expect(201);

        expect(res.body).toHaveProperty('_id');
        expect(res.body.username).toBe(userData.username);
        expect(res.body.email).toBe(userData.email);
    });

    it('trying duplicate user entry', async () => {
        const res = await request(app)
            .post('/users')
            .send(userData)
            .expect(409);

        expect(res.body.message).toBe('Username already exists');
    });

    it('login with correct credentials', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ username: userData.username, password: userData.password })
            .expect(200);

        expect(res.body).toHaveProperty('token');
        expect(res.body.userData.username).toBe(userData.username);
    });

    it('login with wrong password', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ username: userData.username, password: 'wrongpassword' })
            .expect(401);

        expect(res.body.message).toBe('Invalid username or password');
    });
});