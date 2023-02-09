import { Boom } from '@hapi/boom'
import { Request, type Response } from 'express'
import Image from '../schemas/Image'
import RefreshToken from '../schemas/RefreshToken'
import User from '../schemas/User'
import { type JWTData } from '../types/types'

export const deleteRefreshToken = async ({ userId }: JWTData, params, res: Response) => {
  const fetchedUser = await User.findOne({ email: userId })
  if (fetchedUser == null) {
    throw new Boom('User not found', { statusCode: 404 })
  }

  if (!fetchedUser.isAdmin) {
    throw new Boom('You do not have access to this route', { statusCode: 403 })
  }

  await RefreshToken.deleteOne({
    token: params.refreshToken
  })

  return {
    message: 'Refresh token deleted'
  }
}
