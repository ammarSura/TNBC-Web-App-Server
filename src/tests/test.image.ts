import describeWrapper from "./test-setup";
import Image from "../schemas/Image";
import Chance from "chance";
import request from 'supertest';
import app from './test-server';
import User from "../schemas/User";
import { IImage, IUser } from "../types/types";
import { loginUserWithIdToken } from "./utils";

const IMAGES_SAVED = 20;
const chance = new Chance();
describeWrapper("Image tests", () => {
    let accessToken: string | undefined;
    let testUser: IUser | undefined;
    let testImages: IImage[] | undefined;
    beforeAll(async () => {
        testImages = await Promise.all([...Array(IMAGES_SAVED)].map(() => {
            const dummyImage = new Image({
                id: chance.guid(),
                url: chance.url(),
                internalImageId: chance.guid(),
            });
            return dummyImage.save();
        }))
        const newUser = new User({
            name: chance.name(),
            email: chance.email(),
            designation: chance.profession(),
        })
        testUser = await newUser.save()

        const creds = await loginUserWithIdToken(testUser);
        accessToken = creds.accessToken;
    });

    test("Should get image random image", async () => {
        const { body: { imageId, url } } = await request(app)
            .get("/image")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(imageId).toBeDefined();
        expect(url).toBeDefined();
    });

    test("Should fail to get image with invalid token", async () => {
        const accessToken = chance.guid();
        await request(app)
            .get("/image")
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(401);
    });

    test('Should post a mask', async () => {
        const randomImage = chance.pickone(testImages);
        console.log(accessToken, 'asd')
        const { body: {
            id,
            parentImageId,
            createdBy,
            createdAt,
        }} = await request(app)
            .post('/mask')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                imageId: randomImage.id,
            })
            .expect(200)
        expect(id).toBeDefined();
        expect(parentImageId).toBe(randomImage.id);
        expect(createdBy).toBe(testUser?.email);
        expect(createdAt).toBeDefined();
    })

    test("Should not fetch the same imageId twice if its been annotated", async () => {
        const fetchedImageIds: string[] = [];
        for (let i = 0; i < IMAGES_SAVED; i++) {
            const { body: { imageId } } = await request(app)
                .get("/image")
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            await request(app)
                .post('/mask')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    imageId,
                })
                .expect(200)

            expect(imageId).toBeDefined();
            expect(fetchedImageIds).not.toContain(imageId);
            fetchedImageIds.push(imageId);
        }

        const { body: { annotatedImageIds } } = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        expect(annotatedImageIds).toEqual(expect.arrayContaining(fetchedImageIds));
    });


});
