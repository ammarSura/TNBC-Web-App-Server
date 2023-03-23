import { JWTData } from "../types/types";
import User from '../schemas/User'
import { Boom } from "@hapi/boom";
import { Response } from "express";


export const userGet = async(user: JWTData, params: any, res: Response) => {
    const isAdmin = user.isAdmin || false
    if((!isAdmin && params.userId) && (user.userId !== params.userId)) {
        throw new Boom('Forbidden', { statusCode: 403 })
    }
    const email = isAdmin && params.userId ? params.userId : user.userId
    const fetchedUser = await User.findOne({ email }, '-_id -__v')
    if(!fetchedUser) {
        throw new Boom('User not found', { statusCode: 404 })
    }
    
    return fetchedUser
}