import { randomUUID } from "crypto";
import Mask from "../schemas/Mask";
import { JWTData } from "../types/types";
import User from "../schemas/User";
import { Response } from "express";

export const maskPost = async (user: JWTData, params: any, res: Response) => {
    const imageId = params.imageId;
    console.log('imageId', params)
    console.log(`Creating mask for image ${imageId} by user ${user.userId}`);
    const newMask = new Mask({
        id: randomUUID(),
        parentImageId: imageId,
        createdBy: user?.userId,
    });

    const savedMask = await newMask.save();

    await User.findOneAndUpdate({ email: user.userId }, {
        $push: {
            annotatedImageIds: imageId
        }
    });

    return {
        id: savedMask.id,
        parentImageId: savedMask.parentImageId,
        createdBy: savedMask.createdBy,
        createdAt: savedMask.createdAt,
    }
};


