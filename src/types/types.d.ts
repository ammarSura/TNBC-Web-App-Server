import { Response } from 'express'

export type IUser = {
    name: string
    email: string
    token: string
    designation?: string
}

export type ICoors = {
    id: string
    x: number
    y: number
}

export type IAlgorithmMap = {
    algorithm: 'MESMR' | 'otherAlgo'
    annotCoors: ICoors
    correctCounter: number
}

export type IImage = {
    id: string
    url: string
    algorithmMap: IAlgorithmMap[],
    annotsAssessed: number,
    size?: string
}

export type JWTData = {
    user_id: string
}

export type IRoute = (user: JWTData, params: any, res: Response) => Promise<any>
