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
import describeWrapper from './test-setup';
import { loginUserWithIdToken } from './utils';
import RefreshToken from '../schemas/RefreshToken';

const chance = new Chance()
describeWrapper('Login tests', () => {
    let testUser: IUser
    
    beforeAll(async () => {
        const newUser = new User({
            name: chance.name(),
            email: chance.email(),
            token: chance.guid(),
            designation: chance.profession()
        })
        testUser = await newUser.save()
    })
    test('Should login successfully with idToken', async() => {
        await loginUserWithIdToken(testUser)
    })

    test('Should get access token using refresh token', async() => {
        const { refreshToken } = await loginUserWithIdToken(testUser)

        const { body: { accessToken, refreshToken: newRefreshToken }} = await request(app)
            .post('/login')
            .send({ refreshToken })
            .expect(200)
        
        expect(accessToken).toBeDefined()
        expect(newRefreshToken).toBeDefined()
        
        const oldToken = await RefreshToken.findOne({ token: refreshToken })
        expect(oldToken).toBeNull()
    })

    test('Should fail to get access token with garbage refreshToken', async() => {
        const refreshToken = chance.guid()
        const req = { refreshToken }
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
            } as any as Promise<DecodedIdToken>
        })
        const req = {
            idToken: chance.guid()
        }
        await request(app)
            .post('/login')
            .send(req)
            .expect(400)
    })

    test('Should fail to login with expired refresh token', async() => {
        const refreshToken = new RefreshToken({
            token: chance.guid(),
            issuedAt: Date.now() - 2000,
            expiresAt: Date.now() - 1000,
            userId: testUser.email
        })

        await refreshToken.save()

        await request(app)
            .post('/login')
            .send({ refreshToken: refreshToken.token })
            .expect(400)
    })

    test('Should fail to login with invalid refresh token', async() => {
        await request(app)
            .post('/login')
            .expect(400)
    })
})