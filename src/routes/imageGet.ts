import { JWTData } from "../types/types";
import { Boom } from "@hapi/boom";
import { Response } from "express";
import User from '../schemas/User';
import Image from '../schemas/Image';

export const imageGet = async (user: JWTData, params: any, res: Response) => {
    const userDetails = await User.findOne({ email: user.userId }, '-_id -__v -password');

    const randomImage = await Image.findOne({
        id: { $nin: userDetails?.annotatedImageIds }
    });

    if(randomImage) {
        return {
            imageId: randomImage.id,
            url: randomImage.url,
        };
    } else {
        return {
            message: 'No more images to annotate'
        }
    }



};
