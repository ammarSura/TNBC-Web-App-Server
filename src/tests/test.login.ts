import request from 'supertest'
import app from './test-server'
import { Schema, model, connect, Document } from 'mongoose';
import { User } from '../schemas/User'
import { IUser } from '../types/types';
import Chance from 'chance'
import { google } from 'googleapis'
import { FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

const chance = new Chance()
describe('Login tests', () => {
    const testUser = {
        name: chance.name(),
        email: chance.email(),
        password: chance.string(),
        designation: chance.profession()
    }
    beforeAll(async () => {
    
    })

    afterAll(async () => {
    })
  test('Should login successfully', async() => {
    
    const req = {
        idToken: ''
    }
    await request(app)
        .post('/login')
        .send(req)
        .expect(200)
  })

    test('Should fail to login with incorrect password', async() => {
        const req = {
            idToken: ''
        }
        await request(app)
            .post('/login')
            .send({
                username: "ammar",
                password: "1234567"
            })
            .expect(400)
    })
})