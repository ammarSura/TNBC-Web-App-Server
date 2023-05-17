import { type Response } from 'express'

export interface IUser {
  name: string
  email: string
  designation?: string
  isAdmin?: boolean,
  annotatedImageIds?: string[]
}
export interface IImage {
  id: string
  url: string,
  internalImageId: string
}

export interface IMask {
  id: string
  parentImageId: string
  createdBy: string
  createdAt: number
}

export interface JWTData {
  userId: string,
  accessToken: string,
  accessTokenExpiresAt: number,
  refreshToken: string,
  refreshTokenExpiresAt: number
  isAdmin?: boolean
}

export type IRoute = (user: JWTData, params: any, res: Response) => Promise<any>
export interface IRefreshToken {
  token: string
  userId: string
  issuedAt: number
  expiresAt: number
  isAdmin?: boolean
}
