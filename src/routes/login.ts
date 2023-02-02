import { Request, Response } from 'express'
import User from '../schemas/User'
import { model } from 'mongoose'
import { compare } from 'bcrypt'
import admin from 'firebase-admin'
import { initializeApp } from "firebase/app";
import serviceAccount from '../../test-auth-2bc3b-firebase-adminsdk-cqb6a-0bad906651.json'
import firebase from '../utils/initialise-firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { sign } from 'jsonwebtoken'
import { getAccessToken } from '../utils/jwt-utils'
import { JWTData } from '../types/types'

const SECRET_KEY = 'mysecret'
  
export const login =  async(user: JWTData, params, res: Response) => {
    const { idToken } = params
    let isValidIdToken: DecodedIdToken
    try {
        isValidIdToken = await firebase.verifyIdToken(idToken)
    } catch (error) {
        console.log(error)
        return res.status(400).send('Invalid token')
    }
    const { email, name } = isValidIdToken
    
    const fetchedUser = await User.findOne({ email })
    
    if(!fetchedUser) {
        return res.status(400).json({
            message: 'You do not have access to this app'
        })
    }

    const accessToken = getAccessToken({
        user_id: email!
    })

    await fetchedUser.updateOne({ token: accessToken })

    return res.status(200).json({
        accessToken
    })
}