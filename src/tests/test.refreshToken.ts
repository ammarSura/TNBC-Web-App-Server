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
import { createDummyUser, describeWrapper, getUserAccessToken, getAdminUser, loginUserWithIdToken } from './test-setup'


const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

const chance = new Chance()
describeWrapper('Refresh Token tests', () => {
    let adminUser: IUser | undefined
  
    beforeAll(async () => {
        adminUser = await getAdminUser()
        
    })
    test('Should fetch a refresh token and admin delete it', async() => {
        const testUser = await createDummyUser()
        const { refreshToken } = await loginUserWithIdToken(testUser)
        const adminAccessToken = await getUserAccessToken(adminUser!)
        await request(app)
            .delete(`/refreshToken/${refreshToken}`)
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .expect(200)
    })

    test('Should not let non-admin delete refresh token', async() => {
        const testUser1 = await createDummyUser()
        const testUser2 = await createDummyUser()
        const { refreshToken } = await loginUserWithIdToken(testUser1)
        const accessToken = await getUserAccessToken(testUser2)

        await request(app)
            .delete(`/refreshToken/${refreshToken}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(403)
    })
})
