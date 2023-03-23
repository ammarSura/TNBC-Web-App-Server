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
import { createDummyUser, getAdminUser, loginUserWithIdToken } from './utils'
import describeWrapper from './test-setup';

const chance = new Chance()
describeWrapper('Refresh Token tests', () => {
    let adminUser: IUser
  
    beforeAll(async () => {
        adminUser = await getAdminUser()
        
    })
    test('Should fetch a refresh token and admin delete it', async() => {
        const testUser = await createDummyUser()
        const { refreshToken: userRefreshToken } = await loginUserWithIdToken(testUser)
        const { accessToken: adminAccessToken} = await loginUserWithIdToken(adminUser)
        await request(app)
            .delete(`/refreshToken/${userRefreshToken}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(200)
    })

    test('Should not let non-admin delete refresh token', async() => {
        const testUser1 = await createDummyUser()
        const testUser2 = await createDummyUser()
        const { refreshToken } = await loginUserWithIdToken(testUser1)
        const { accessToken: nonAdminAccessToken } = await loginUserWithIdToken(testUser2)

        await request(app)
            .delete(`/refreshToken/${refreshToken}`)
            .set('Authorization', `Bearer ${nonAdminAccessToken}`)
            .expect(403)
    })

    test('Should not allow garbage access token', async() => {
        await request(app)
            .delete(`/refreshToken/${chance.guid()}`)
            .set('Authorization', `Bearer ${chance.guid()}`)
            .expect(401)
    })

    test('Should fail without auth header', async() => {
        await request(app)
            .delete(`/refreshToken/${chance.guid()}`)
            .expect(400)
    })

})
