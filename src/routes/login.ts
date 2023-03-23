import { Request, type Response } from 'express'
import User from '../schemas/User'
import firebase from '../utils/initialise-firebase'
import { type DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { getAccessToken } from '../utils/jwt-utils'
import { type JWTData } from '../types/types'
import { randomUUID } from 'crypto'
import RefreshToken from '../schemas/RefreshToken'
import { Boom } from '@hapi/boom'

export const login = async (user: JWTData, params, res: Response) => {
  const idToken = params?.idToken
  const refreshToken = params?.refreshToken
  let email: string | undefined
  const result: {
    accessToken?: string
    accessTokenExpiresAt?: number
    refreshToken?: string
    refreshTokenExpiresAt?: number

  } = {}
  let isAdmin = false
  if (refreshToken) {
    const fetchedToken = await RefreshToken
      .findOneAndDelete({ token: refreshToken })
    if (fetchedToken == null) {
      throw new Boom('Invalid refresh token', { statusCode: 400 })
    }

    if(fetchedToken.expiresAt < Date.now()) {
      throw new Boom('Refresh token expired', { statusCode: 400 })
    }
    email = fetchedToken.userId
    isAdmin = fetchedToken?.isAdmin || false
  } else {
    let isValidIdToken: DecodedIdToken
    try {
      isValidIdToken = await firebase.verifyIdToken(idToken)
    } catch (error) {
      throw new Boom('Invalid refresh token', { statusCode: 400 })
    }
    email = isValidIdToken.email
    const fetchedUser = await User.findOne({ email })
    isAdmin = fetchedUser?.isAdmin || false

    if (fetchedUser === null) {
      throw new Boom('You do not have access to this app', { statusCode: 400 })
    }
  }
  const refreshTokenIssuedAt = Date.now()
  const newRefreshToken = await RefreshToken
      .create({
        token: randomUUID(),
        issuedAt: refreshTokenIssuedAt,
        expiresAt: refreshTokenIssuedAt + 1000 * 60 * 60 * 24 * 7,
        userId: email,
        isAdmin
      })
    result.refreshToken = newRefreshToken.token
    result.refreshTokenExpiresAt = newRefreshToken.expiresAt
    const { accessToken, accessTokenExpiresAt } = getAccessToken(email!, isAdmin)

    result.accessToken = accessToken
    result.accessTokenExpiresAt = accessTokenExpiresAt

  return result
}
