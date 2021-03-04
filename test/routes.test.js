'use strict'

const app = require('../src/app')
const supertest = require('supertest')
const request = supertest(app)

let server

describe('Testing application routes', () => {

    beforeAll((done) => {
        server = app.listen(done)
    })

    afterAll((done) => {
        server.close(done)
    })

    test('Gets the first test endpoint', async done => {
        //Sends GET Request to /first_test endpoint
        const response = await request.get('/first_test')

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('My firt test pass!')
        done()
    })

    test('Should save data to file', async() => {
        //Sends POST Request to /members endpoint
        const res = await request.post('/members')
            .send(
                {
                    name: 'Aissata',
                    age: 27
                })

        expect(res.statusCode).toBe(200)
        //expect(res.body.name).toBeTruthy()
        //expect(res.body.age).toBeTruthy()
    })

    test('Should save data to file', async() => {
        //Sends POST Request to /members endpoint
        const res = await request.post('/members')
            .send(
                {
                    name: 'Luxiya',
                    age: 25
                })

        expect(res.statusCode).toBe(200)
        //expect(res.body.name).toBeTruthy()
        //expect(res.body.age).toBeTruthy()
    })

    test('Should save data to file', async() => {
        //Sends POST Request to /members endpoint
        const res = await request.post('/members')
            .send(
                {
                    name: 'Sarra',
                    age: 29
                })

        expect(res.statusCode).toBe(200)
        //expect(res.body.name).toBeTruthy()
        //expect(res.body.age).toBeTruthy()
    })

    test('Should save data to file', async() => {
        //Sends POST Request to /members endpoint
        const res = await request.post('/members')
            .send(
                {
                    name: 'John'
                })

        expect(res.statusCode).toBe(400)
        expect(res.body.msg).toBe('Please include a name and age')
    })

    test('Provides all data', () => {
        //Sends GET Request to /members endpoint
        return request
            .get('/members')
            .set('Accept', 'application/json')
            .then(res => {
                expect(res.statusCode).toBe(200)

            })
    })

    test('Provides one data', async done => {
        //Sends GET Request to /members endpoint
        const res = await request.get('/members/1')
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toMatch(/application\/json/)
        expect(res.body).toBeInstanceOf(Object)
        done()
    })
})