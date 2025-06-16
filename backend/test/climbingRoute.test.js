const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const ClimbingRouteModel = require('../models/climbingRouteModel');
const request = require('supertest');
const app = require('../app');

describe('ClimbingRoute API', () => {
    let token;
    let userId;
    let RouteId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });
        // Create a user and login to get token
        const user = new UserModel({
            username: 'routeuser',
            email: 'routeuser@test.com',
            password: await require('bcryptjs').hash('RoutePassword', 10)
        });
        await user.save();
        userId = user._id;
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'routeuser', password: 'RoutePassword' });
        token = res.body.token;
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ClimbingRouteModel.deleteMany({});
        await mongoose.connection.close();
    });

    it('create a new climbing Route', async () => {
        const res = await request(app)
            .post('/climbingRoutes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Route',
                length: 20,
                type: 'Sport',
                climbingArea: '60d5f484f1d2c8b8b8b8b8b8', // Example
                postedBy: userId
            })
            .expect(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Route');
        RouteId = res.body._id;
    });

    it('list all climbing Routes', async () => {
        const res = await request(app)
            .get('/climbingRoutes')
            .expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(r => r._id === RouteId)).toBe(true);
    });

    it('get a climbing Route by id', async () => {
        const res = await request(app)
            .get(`/climbingRoutes/${RouteId}`)
            .expect(200);
        expect(res.body).toHaveProperty('_id', RouteId);
        expect(res.body.name).toBe('Test Route');
    });
});