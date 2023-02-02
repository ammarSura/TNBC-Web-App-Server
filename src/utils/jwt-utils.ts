import { sign, verify } from "jsonwebtoken"
import { JWTData } from "../types/types"

const nodeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({ path: `.env.${nodeEnv}` })

const secretKey = process.env.SECRET_KEY!


export const verifyToken = (auth: string) => {
    const cleanedToken = auth.replace('Bearer ', '')
    try {
        return verify(cleanedToken, secretKey, { complete: true })
    } catch(e) {
        return false
    }
}

export const getAccessToken = (details: JWTData) => {
    const accessToken = sign(
        details,
        secretKey,
        {
          expiresIn: "1h",
        }
    )
    return accessToken
} 
