const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const ClimbingCenterModel = require('../models/climbingCenterModel');

describe('ClimbingCenter API', () => {
    let token;
    let userId;
    let centerId;

    const testUserCredentials = {
        username: 'centeruser',
        email: 'centeruser@test.com',
        password: 'CenterPassword'
    };

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_LINK, { useNewUrlParser: true, useUnifiedTopology: true });

        const registrationRes = await request(app)
            .post('/users')
            .send(testUserCredentials);
        if (registrationRes.status === 201 && registrationRes.body._id) {
            userId = registrationRes.body._id;
        } else if (registrationRes.status === 409) {
            console.warn('User might already exist or registration failed:', registrationRes.body);
        } else if (registrationRes.status !== 201) {
            throw new Error(`User registration failed with status ${registrationRes.status}: ${JSON.stringify(registrationRes.body)}`);
        }

        const loginRes = await request(app)
            .post('/users/login')
            .send({ username: testUserCredentials.username, password: testUserCredentials.password });

        if (loginRes.status !== 200) {
            console.error('Login failed after API registration:', loginRes.body);
            throw new Error(`Login failed with status ${loginRes.status} after attempting API registration.`);
        }
        token = loginRes.body.token;
        if (!userId && loginRes.body.userData && loginRes.body.userData._id) {
            userId = loginRes.body.userData._id;
        }
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