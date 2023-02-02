import { randomBytes } from 'crypto'
import request from 'supertest'
import app from './test-server'
import firebase from '../utils/initialise-firebase'
import Chance from 'chance'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { getAccessToken } from '../utils/jwt-utils'
import Image from '../schemas/Image'
import { connect, connection } from 'mongoose'
import { TEST_TOKEN } from './utils'
const chance = new Chance()


describe('Image annotation best result tests', () => {
    beforeAll(async () => {
        await connect('mongodb://localhost:27017/tnbc-test')
        // jwtUtils.verifyToken = jest.fn((auth) => {
        //     return true
    // })

        const testImage1 = {
            id: `img_${randomBytes(4).toString('hex')}`,
            url: 'https://res.cloudinary.com/dkdcclij4/image/upload/v1668799988/WHALW_xs6pe6.png',
            algorithmMap: [
                {
                    algorithm: 'MESMR',
                    annotCoors: {
                        id: `coors_${randomBytes(4).toString('hex')}`,
                        x: 30,
                        y: 30,
                    },
                    correctCounter: 0,
                }
            ],
            annotsAssessed: 0,       
        }
        const testImage2 = {
            id: `img_${randomBytes(4).toString('hex')}`,
            url: 'https://res.cloudinary.com/dkdcclij4/image/upload/v1668803716/asdwhale_teoqar.png',
            algorithmMap: [
                {
                    algorithm: 'MESMR',
                    annotCoors: {
                        id: `coors_${randomBytes(4).toString('hex')}`,
                        x: 20,
                        y: 20,
                    },
                    correctCounter: 0,
                }
            ],
            annotsAssessed: 0,   
        }
        const newImage1 = new Image(testImage1)
        const newImage2 = new Image(testImage2)
        await newImage1.save()
        await newImage2.save()
    })

    afterAll(async () => {
        await connection.close()
    })

    test('Should post an image with coors of best one', async () => {
        const { body } = await request(app)
            .get('/images')
            .set('Authorization', `Bearer ${TEST_TOKEN}`)
            .expect(200)

        const { imageId, url,  coors } = body

        const { coorId } = chance.pickone(coors)

        const imageBeforeRoute = await Image.findOne({ id: imageId })
        const correctCounterBefore = imageBeforeRoute!.annotsAssessed
        const bestCoorBefore = imageBeforeRoute!.algorithmMap.find((coor) => coor.annotCoors.id === coorId)
        const bestCoorBeforeCounter = bestCoorBefore!.correctCounter


        await request(app)
            .patch(`/images-annotation-selection/${imageId}`)
            .set('Authorization', `Bearer ${TEST_TOKEN}`)
            .query({ coorId })
            .expect(200)

        const imageAfterRoute = await Image.findOne({ id: imageId })

        const correctCounterAfter = imageAfterRoute!.annotsAssessed
        const bestCoorAfter = imageAfterRoute!.algorithmMap.find((coor) => coor.annotCoors.id === coorId)
        const bestCoorAfterCounter = bestCoorAfter!.correctCounter
        expect(bestCoorAfterCounter).toBe(bestCoorBeforeCounter + 1)
        expect(correctCounterAfter).toBe(correctCounterBefore + 1)
    })
})