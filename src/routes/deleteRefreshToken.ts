import { Request, type Response } from 'express'
import Image from '../schemas/Image'
import RefreshToken from '../schemas/RefreshToken'
import User from '../schemas/User'
import { type JWTData } from '../types/types'

export const deleteRefreshToken = async ({ userId }: JWTData, params, res: Response) => {
  const fetchedUser = await User.findOne({ email: userId })
  if (fetchedUser == null) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  if (!fetchedUser.isAdmin) {
    return res.status(403).json({
      message: 'You do not have access to this route'
    })
  }

  await RefreshToken.deleteOne({
    token: params.refreshToken
  })

  return res.status(200).json({
    message: 'success'
  })
}
