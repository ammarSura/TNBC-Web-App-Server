import { type Request, type Response } from 'express'
import { verify } from 'jsonwebtoken'
export const coordinatesGet = async (_, req: Request, res: Response) => {
  const auth = req.headers.authorization
  try {
    const cleanedToken = auth!.slice(1, -1)
    verify(cleanedToken, 'mysecret')
  } catch (e) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  res.status(200).json({

    id: req.params.id,
    x: 30,
    y: 30

  })
}
