const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

afterAll(async () => {
    await mongoose.disconnect();
});

describe('GET /users/test', () => {
    it('should return 200 and a message', async () => {
        const res = await request(app).get('/users/test');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Connection successful!');
    });
});

/*describe('POST /users/login', () => {
    it('should return 500 and a message', async () => {
        const res = await request(app).post('/users/login');
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Error when logging in');
    });
});*/