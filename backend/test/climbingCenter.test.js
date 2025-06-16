const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const ClimbingCenterModel = require('../models/climbingCenterModel');

describe('ClimbingCenter API', () => {
    let token;
    let userId;
    let centerId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });
        // Create a user and login to get token
        const user = new UserModel({
            username: 'centeruser',
            email: 'centeruser@test.com',
            password: await require('bcryptjs').hash('CenterPassword', 10)
        });
        await user.save();
        userId = user._id;
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'centeruser', password: 'CenterPassword' });
        token = res.body.token;
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ClimbingCenterModel.deleteMany({});
        await mongoose.connection.close();
    });

    it('create a new climbing center', async () => {
        const res = await request(app)
            .post('/climbingCenter')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Center',
                latitude: 46.0,
                longitude: 14.5,
                description: 'Test'
            })
            .expect(201);

        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Test Center');
        centerId = res.body._id;
    });

    it('list all climbing centers', async () => {
        const res = await request(app)
            .get('/climbingCenter')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(c => c._id === centerId)).toBe(true);
    });

    it('get a climbing center by id', async () => {
        const res = await request(app)
            .get(`/climbingCenter/${centerId}`)
            .expect(200);

        expect(res.body).toHaveProperty('_id', centerId);
        expect(res.body.name).toBe('Test Center');
    });
});