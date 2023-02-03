import request from 'supertest'
import app from './test-server'
import { Schema, model, connect, Document, connection } from 'mongoose';
import User from '../schemas/User'
import { IUser } from '../types/types';
import Chance from 'chance'
import { google } from 'googleapis'
import { FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import 'firebase/compat/auth'
import firebase from '../utils/initialise-firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

const chance = new Chance()
describe('Login tests', () => {
    const testUser = {
        name: chance.name(),
        email: chance.email(),
        token: chance.guid(),
        designation: chance.profession()
    }
    
    beforeAll(async () => {
        await connect('mongodb://localhost:27017/tnbc-test')
        const newUser = new User(testUser)
        await newUser.save()
        
    })

    afterAll(async () => {
        await connection.close()
    })
    test('Should login successfully with idToken', async() => {
        firebase.verifyIdToken = jest.fn((idToken) => {
            return {
                email: testUser.email,
                name: testUser.name
            } as unknown as Promise<DecodedIdToken>
        })
        const req = {
            idToken: chance.guid()
        }
        const { body: { accessToken, refreshToken, refreshTokenExpiresAt} } = await request(app)
            .post('/login')
            .send(req)
            .expect(200)

        expect(accessToken).toBeDefined()
        expect(refreshToken).toBeDefined()
        expect(refreshTokenExpiresAt).toBeDefined()
    })

    test('Should get access token using refresh token', async() => {
        firebase.verifyIdToken = jest.fn((idToken) => {
            return {
                email: testUser.email,
                name: testUser.name
            } as unknown as Promise<DecodedIdToken>
        })
        const req = {
            idToken: chance.guid()
        }
        const { body: { refreshToken } } = await request(app)
            .post('/login')
            .send(req)
            .expect(200)

        const { body: body1 } =await request(app)
            .post('/login')
            .send({ refreshToken })
            .expect(200)

        console.log(body1)
    })

    test('Should fail to get access token with garbage refreshToken', async() => {
        const refreshToken = chance.guid()
        const req = {refreshToken}
        await request(app)
            .post('/login')
            .send(req)
            .expect(400)
    })

    test('Should fail to login with random user', async() => {
        firebase.verifyIdToken = jest.fn((idToken) => {
            return {
                email: chance.email(),
                name: chance.name()
            } as unknown as Promise<DecodedIdToken>
        })
        const req = {
            idToken: chance.guid()
        }
        await request(app)
            .post('/login')
            .send(req)
            .expect(400)
    })
})