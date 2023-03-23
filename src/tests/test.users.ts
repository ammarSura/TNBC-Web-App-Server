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
describeWrapper('User tests', () => {
    let testUser: IUser
    beforeAll(async () => {        
        const newUser = new User({
            name: chance.name(),
            email: chance.email(),
            designation: chance.profession(),
        })
        testUser = await newUser.save()
    })

    test('Should get user details', async() => {
        const { accessToken } = await loginUserWithIdToken(testUser)
        const { body: { name, email, designation } } = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        
        expect(name).toBe(testUser.name)
        expect(email).toBe(testUser.email)
        expect(designation).toBe(testUser.designation)
    })

    test('Should fail to fetch user with invalid token', async() => {
        const accessToken = chance.guid()
        await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(401)
    })

    test('Should fail to fetch user with token of another user', async() => {
        const testUser2 = await createDummyUser()
        const { accessToken } = await loginUserWithIdToken(testUser)
        await request(app)
            .get('/user')
            .query({ userId: testUser2.email })
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(403)
    })

    test('Should allow admin to fetch user details', async() => {
        const adminUser = await getAdminUser()
        const {accessToken} = await loginUserWithIdToken(adminUser)
        const { body: { name, email, designation } } = await request(app)
            .get('/user')
            .query({ userId: testUser.email })
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        
        expect(name).toBe(testUser.name)
        expect(email).toBe(testUser.email)
        expect(designation).toBe(testUser.designation)
    })

    test('Should allow admin to fetch own details if no userId param is specified', async() => {
        const adminUser = await getAdminUser()
        const { accessToken } = await loginUserWithIdToken(adminUser)
        const { body: { name, email, designation } } = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        
        expect(name).toBe(adminUser.name)
        expect(email).toBe(adminUser.email)
        expect(designation).toBe(adminUser.designation)
    })
    
})
