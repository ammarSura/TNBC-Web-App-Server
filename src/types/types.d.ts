import { type Response } from 'express'

export interface IUser {
  name: string
  email: string
  designation?: string
  isAdmin?: boolean
}

export interface ICoors {
  id: string
  x: number
  y: number
}

export interface IAlgorithmMap {
  algorithm: 'MESMR' | 'otherAlgo'
  annotCoors: ICoors
  correctCounter: number
}

export interface IImage {
  id: string
  url: string
  algorithmMap: IAlgorithmMap[]
  annotsAssessed: number
  size?: string
}

export interface JWTData {
  userId: string
}

export type IRoute = (user: JWTData, params: any, res: Response) => Promise<any>

export interface IRefreshToken {
  token: string
  userId: string
  expiresAt: number
}
