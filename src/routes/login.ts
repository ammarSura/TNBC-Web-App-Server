import { Request, Response } from 'express'
import { User} from '../schemas/User'
import { model } from 'mongoose'
import { compare } from 'bcrypt'
import admin from 'firebase-admin'
import { initializeApp } from "firebase/app";
import serviceAccount from '../../test-auth-2bc3b-firebase-adminsdk-cqb6a-0bad906651.json'
import firebase from '../utils/initialise-firebase'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
  
export const login =  async(c, req: Request, res: Response) => {
    const { idToken } = req.body    
    let isValidIdToken: DecodedIdToken
    try {
        isValidIdToken = await firebase.verifyIdToken(idToken)

    } catch (error) {
        console.log(error)
        return res.status(400).send('Invalid token')
    }
    const { email, name } = isValidIdToken
    
    const userModel = model('User', User)
    const fetchedUser = await userModel.findOne({ email })

    console.log(fetchedUser, email)
    
    if(!fetchedUser) {
        return res.status(400).json({
            message: 'You do not have access to this app'
        })
    }

    return res.status(200).json({
        user: fetchedUser.email,
        message: 'Login successful'
    })
}