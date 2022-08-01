const request = require('supertest');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const mongoose = require('mongoose');

const Application = require('../../src/application');
const UserSchema = require('../../src/schemas/user-schema');

describe('Users', () => {
    let application = null;
    let mongod = null;

    process.env.JWT_TOKEN_SECRET = "secret123";
    const {
        host: HOST,
        port: PORT,
        databaseName: DATABASE_NAME,
    } = config.get('mongo');

    async function initializeUsersCollection() {
        const mongooseInstance = await mongoose.connect(
            `mongodb://${HOST}:${PORT}/${DATABASE_NAME}`
        );
    
        const User = mongoose.model('user', UserSchema);
    
        await User.create({
            username: "admin",
            password: md5("password123"),
            role: "admin",
        });

        await User.create({
            username: "userManager",
            password: md5("password123"),
            role: "userManager",
        });
    
        await mongooseInstance.disconnect();
    }

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create({
            instance: {
                ip: HOST,
                port: PORT,
                dbName: DATABASE_NAME,
            }
        });

        await initializeUsersCollection();

        application = new Application();
        await application.initialize();
    });

    afterAll(async () => {
        await application.terminate();

        await mongod.stop();
    });

    it('userManager deletes a user', async () => {
        const userCredentials = {
            username: "user",
            password: "password123",
        };
        const userManagerCredentials = {
            username: "userManager",
            password: "password123",
        };

        await request(application.expressApp)
            .post('/account/register')
            .send(userCredentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        const loginResponse = await request(application.expressApp)
            .post('/account/login')
            .send(userManagerCredentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        const jwtToken = loginResponse.text;

        let listResponse = await request(application.expressApp)
            .get('/user/list')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(listResponse.body).toMatchObject([{
            username: "user",
            password: "482c811da5d5b4bc6d497ffa98491e38",
            role: "user",
        }]);

        const deletionResponse = await request(application.expressApp)
            .delete(`/user/delete?username=${userCredentials.username}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        expect(deletionResponse.text).toBe(`User ${userCredentials.username} succesfully deleted.`);

        listResponse = await request(application.expressApp)
            .get('/user/list')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(listResponse.body).toMatchObject([]);
    });

    it('admin demotes a userManager', async () => {
        const adminCredentials = {
            username: "admin",
            password: "password123",
        };

        const loginResponse = await request(application.expressApp)
            .post('/account/login')
            .send(adminCredentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        const jwtToken = loginResponse.text;

        let listResponse = await request(application.expressApp)
            .get('/user/list')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(listResponse.body).toMatchObject([{
            username: "admin",
            password: "482c811da5d5b4bc6d497ffa98491e38",
            role: "admin",
        }, {
            username: "userManager",
            password: "482c811da5d5b4bc6d497ffa98491e38",
            role: "userManager",
        }]);

        const newUserManagerData = {
            username: "userManager",
            password: "482c811da5d5b4bc6d497ffa98491e38",
            role: "user",
        };

        const editResponse = await request(application.expressApp)
            .patch('/user/edit')
            .send(newUserManagerData)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        expect(editResponse.text).toBe(`User ${newUserManagerData.username} succesfully edited.`);

        listResponse = await request(application.expressApp)
            .get('/user/list')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(listResponse.body).toMatchObject([{
            username: "admin",
            password: "482c811da5d5b4bc6d497ffa98491e38",
            role: "admin",
        }, {
            username: "userManager",
            password: "482c811da5d5b4bc6d497ffa98491e38",
            role: "user",
        }]);
    });
});