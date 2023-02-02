import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import Chance from 'chance'
import Image from '../schemas/Image'
import { JWTData } from '../types/types'


export const imagesGet =  async(user: JWTData, _, res: Response) => {

    const image = await Image
        .find()
        .limit(1)
        .sort({ annotsAssessed : 1 })

    const { id, url, algorithmMap } = image[0]
    const coors = algorithmMap.map(({ annotCoors: { id: coorId, x, y }}) => {
        return {
            coorId,
            x,
            y
        }
    })

    return res.status(200).json({
        imageId: id,
        url,
        coors
    })
}