import { connect, connection } from "mongoose"
import Chance from 'chance'
import User from "../schemas/User"
import { IRefreshToken, IUser } from "../types/types"
import firebase from '../utils/initialise-firebase'
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import request from 'supertest'
import app from './test-server'
import RefreshToken from "../schemas/RefreshToken"


const chance = new Chance()
export const getAdminUser = async() => {
    let adminUser: IUser | null = await User.findOne({ isAdmin: true })
    if(!adminUser) {
        adminUser = {
            name: chance.name(),
            email: chance.email(),
            designation: chance.profession(),
            isAdmin: true
        }
        const newUser = new User(adminUser)
        await newUser.save()
    }
    return adminUser
}

export const getUserAccessToken = async(user: IUser) => {

    let refreshToken: IRefreshToken | null = await RefreshToken.findOne({ userId: user.email })
    if(!refreshToken) {
        const { refreshToken: newRefreshToken } = await loginUserWithIdToken(user)
        refreshToken = newRefreshToken
    }
   const { body: { accessToken } } = await request(app)
            .post('/login')
            .send({ refreshToken })
            .expect(200)

    return accessToken
}

export const loginUserWithIdToken = async(user: IUser) => {
    firebase.verifyIdToken = jest.fn((idToken) => {
        return {
            email: user.email,
            name: user.name
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

    return {
        accessToken,
        refreshToken,
        refreshTokenExpiresAt
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

export const describeWrapper = async(suiteName: string, childTests: () => void) => {
    describe(suiteName, () => {
        beforeAll(async () => {
            await connect('mongodb://localhost:27017/tnbc-test')
            
        })    

        childTests()

        afterAll(async () => {
            // await connection.close()
            const { email } = await getAdminUser()
            await User.deleteOne({ email })
        })
    })
    
}