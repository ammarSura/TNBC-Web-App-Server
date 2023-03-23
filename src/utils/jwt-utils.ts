import { sign, verify } from 'jsonwebtoken'
import { type JWTData } from '../types/types'

const nodeEnv = process.env.NODE_ENV || 'test'
require('dotenv').config({ path: `.env.${nodeEnv}` })
const EXPIRATION_IN_MINUTES = 8 * 60

const secretKey = process.env.SECRET_KEY!

export const verifyToken = (auth: string) => {
  const cleanedToken = auth.replace('Bearer ', '')
  try {
    return verify(cleanedToken, secretKey, { complete: true })
  } catch (e) {
    return false
  }
}

export const getAccessToken = (userId: string, isAdmin?: boolean) => {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + EXPIRATION_IN_MINUTES * 60
  const data = {
    userId,
    iat,
    exp,
    isAdmin,
  }
  const accessToken = sign(
    data,
    secretKey,
  )
  return {accessToken, accessTokenExpiresAt: exp}
}
