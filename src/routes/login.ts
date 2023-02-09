import { Request, type Response } from 'express'
import User from '../schemas/User'
import firebase from '../utils/initialise-firebase'
import { type DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { getAccessToken } from '../utils/jwt-utils'
import { type JWTData } from '../types/types'
import { randomUUID } from 'crypto'
import RefreshToken from '../schemas/RefreshToken'
import { Boom } from '@hapi/boom'

const SECRET_KEY = 'mysecret'

export const login = async (user: JWTData, params, res: Response) => {
  const idToken = params?.idToken
  const refreshToken = params?.refreshToken
  let email: string | undefined
  const result: {
    accessToken?: string
    refreshToken?: string
    refreshTokenExpiresAt?: number

  } = {}
  if (refreshToken) {
    const fetchedToken = await RefreshToken
      .findOne({ token: refreshToken })
    if (fetchedToken == null) {
      throw new Boom('Invalid refresh token', { statusCode: 400 })
    }
    email = fetchedToken.userId
  } else {
    let isValidIdToken: DecodedIdToken
    try {
      isValidIdToken = await firebase.verifyIdToken(idToken)
    } catch (error) {
      throw new Boom('Invalid refresh token', { statusCode: 400 })
    }
    email = isValidIdToken.email
    const fetchedUser = await User.findOne({ email })

    if (fetchedUser == null) {
      throw new Boom('You do not have access to this app', { statusCode: 403 })
    }
    const newRefreshToken = await RefreshToken
      .create({
        token: randomUUID(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        userId: email
      })
    result.refreshToken = newRefreshToken.token
    result.refreshTokenExpiresAt = newRefreshToken.expiresAt
  }

  result.accessToken = getAccessToken({
    userId: email!
  })

  return result
}
