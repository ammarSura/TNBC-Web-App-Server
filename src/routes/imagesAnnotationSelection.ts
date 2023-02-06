import { Request, type Response } from 'express'
import Image from '../schemas/Image'
import { type JWTData } from '../types/types'

export const imagesAnnotationSelection = async (user: JWTData, params, res: Response) => {
  const { imageId, coorId } = params

  const image = await Image.findOne({ id: imageId })

  if (image == null) {
    return res.status(404).json({
      message: 'Image not found'
    })
  }

  image.annotsAssessed += 1
  image.algorithmMap = image.algorithmMap.map((alg) => {
    if (alg.annotCoors.id === coorId) {
      alg.correctCounter += 1
    }
    return alg
  })
  image.markModified('algorithmMap')
  await image.save()

  return res.status(200).json({
    message: 'Success'
  })
}
