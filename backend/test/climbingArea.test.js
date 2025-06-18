const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const ClimbingAreaModel = require('../models/climbingAreaModel');

describe('ClimbingArea API', () => {
    let token;
    let userId;
    let areaId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });
        // Create a user and login to get token
        const user = new UserModel({
            username: 'areauser',
            email: 'areauser@example.com',
            password: await require('bcryptjs').hash('AreaPassword', 10)
        });
        await user.save();
        userId = user._id;
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'areauser', password: 'AreaPassword' });
        token = res.body.token;
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ClimbingAreaModel.deleteMany({});
        await mongoose.connection.close();
    });

    it('create a new climbing area', async () => {
        const res = await request(app)
            .post('/climbingAreas')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Area',
                latitude: 46.0,
                longitude: 14.5,
                description: 'Test'
            })
            .expect(201);

        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Area');
        areaId = res.body._id;
    });

    it('list all climbing areas', async () => {
        const res = await request(app)
            .get('/climbingAreas')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(a => a._id === areaId)).toBe(true);
    });

    it('get a climbing area by id', async () => {
        const res = await request(app)
            .get(`/climbingAreas/${areaId}`)
            .expect(200);

        expect(res.body).toHaveProperty('_id', areaId);
        expect(res.body.name).toBe('Test Area');
    });
});