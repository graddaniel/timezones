const request = require('supertest');
const md5 = require('md5');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { StatusCodes } = require('http-status-codes');
const config = require('config');
const mongoose = require('mongoose');

const Application = require('../../src/application');
const UserSchema = require('../../src/schemas/user-schema');

describe('Timezone', () => {
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

    it('user creates a timezone', async () => {
        const userCredentials = {
            username: "user",
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
            .send(userCredentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        const jwtToken = loginResponse.text;

        const newTimezone = {
            name: "Germany time zone",
            cityName: "Berlin",
            timeDifference: "+1:00",
            username: "user"
        };
        let addResponse = await request(application.expressApp)
            .post('/timezone/add')
            .send(newTimezone)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        expect(addResponse.text).toBe('Timezone succesfully added.');

        const listResponse = await request(application.expressApp)
            .get('/timezone/list')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(listResponse.body).toMatchObject({
            timezones:[{
                cityName: "Berlin",
                name: "Germany time zone",
                timeDifference: "+1:00",
                username: "user"
            }],
            pageCount: 1,
        });
    });

    it('admin edits a timezone', async () => {
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
            .get('/timezone/list')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(listResponse.body).toMatchObject({
            timezones: [{
                cityName: "Berlin",
                name: "Germany time zone",
                timeDifference: "+1:00",
                username: "user"
            }],
            pageCount: 1,
        });

        await request(application.expressApp)
            .post('/user/add')
            .send({
                username: "user2",
                password: "password123",
                role: "user",
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);       

        const editedTimezone = {
            id: listResponse.body.timezones[0].id,
            username: "user2"
        };
        const editResponse = await request(application.expressApp)
            .patch('/timezone/edit')
            .send(editedTimezone)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        expect(editResponse.text).toBe('Timezone succesfully edited.');

        listResponse = await request(application.expressApp)
            .get('/timezone/list')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(listResponse.body).toMatchObject({
            timezones: [{
                cityName: "Berlin",
                name: "Germany time zone",
                timeDifference: "+1:00",
                username: "user2"
            }],
            pageCount: 1,
        });
    });
});