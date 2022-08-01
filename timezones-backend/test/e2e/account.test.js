const request = require('supertest');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { StatusCodes } = require('http-status-codes');
const config = require('config');

const Application = require('../../src/application');

describe('Account', () => {
    let application = null;
    let mongod = null;

    process.env.JWT_TOKEN_SECRET = "secret123";

    const {
        host: HOST,
        port: PORT,
        databaseName: DATABASE_NAME,
    } = config.get('mongo');

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create({
            instance: {
                ip: HOST,
                port: PORT,
                dbName: DATABASE_NAME,
            }
        });

        application = new Application();
        await application.initialize();
    });

    afterAll(async () => {
        await application.terminate();

        await mongod.stop();
    });

    it('Login before registration', async () => {
        const credentials = {
            username: "user1",
            password: "password123",
        };

        const response = await request(application.expressApp)
            .post('/account/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(StatusCodes.NOT_FOUND);

        expect(response.body.message).toBe('Account credentials not valid.');
    });

    it('Register', async () => {
        const credentials = {
            username: "user1",
            password: "password123",
        };

        const response = await request(application.expressApp)
            .post('/account/register')
            .send(credentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        expect(response.text).toBe(`User ${credentials.username} has been created.`);
    });

    it('Login after registration', async () => {
        const credentials = {
            username: "user1",
            password: "password123",
        };

        const response = await request(application.expressApp)
            .post('/account/login')
            .send(credentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /text/)
            .expect(StatusCodes.OK);

        const token = response.text;
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        
        expect(decodedToken).toMatchObject({
            username: credentials.username,
        });
    });

    it('Register with incorrect password', async () => {
        const credentials = {
            username: "user1",
            password: "$%^",
        };

        const response = await request(application.expressApp)
            .post('/account/register')
            .send(credentials)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(StatusCodes.BAD_REQUEST);

        expect(response.body.message).toBe(`Invalid password: ${credentials.password}.`);
    });
});