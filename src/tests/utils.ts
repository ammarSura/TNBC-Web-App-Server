import { getAccessToken } from "../utils/jwt-utils";
import Chance from "chance"
import { IRefreshToken, IUser } from "../types/types"
import firebase from '../utils/initialise-firebase'
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import request from 'supertest'
import app from './test-server'
import RefreshToken from "../schemas/RefreshToken"
import User from "../schemas/User"

const chance = new Chance()

export const TEST_TOKEN = getAccessToken("email@email.com")

export const getAdminUser = async() => {
    let adminUser: IUser | null = await User.findOne({ isAdmin: true })
    if(!adminUser) {
        const newUser = new User({
            name: chance.name(),
            email: chance.email(),
            designation: chance.profession(),
            isAdmin: true
        })
        adminUser = await newUser.save()
    }
    return adminUser
}

export const loginUserWithIdToken = async(user: IUser) => {
    const isAdmin = user.isAdmin
    firebase.verifyIdToken = jest.fn((idToken) => {
        return {
            email: user.email,
            name: user.name,
            isAdmin
        } as unknown as Promise<DecodedIdToken>
    })
    const req = {
        idToken: chance.guid()
    }

    const { body: { accessToken, refreshToken, refreshTokenExpiresAt, accessTokenExpiresAt}, statusCode } = await request(app)
        .post('/login')
        .send(req)
        .expect(200)

    expect(accessToken).toBeDefined()
    expect(refreshToken).toBeDefined()
    expect(refreshTokenExpiresAt).toBeDefined()
    expect(accessTokenExpiresAt).toBeDefined()

    return {
        accessToken,
        refreshToken,
        refreshTokenExpiresAt,
        accessTokenExpiresAt
    }
}

export const createDummyUser = async() => {
    const testUser = {
        name: chance.name(),
        email: chance.email(),
        token: chance.guid(),
        designation: chance.profession()
    }

    const newUser = new User(testUser)
    await newUser.save()

    return testUser
}