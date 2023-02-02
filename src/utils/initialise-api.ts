import OpenAPIBackend, { Context } from 'openapi-backend'
import { login } from '../routes/login'
import { imagesGet } from '../routes/imagesGet'
import { Response } from 'express'
import { coordinatesGet } from '../routes/coordinatesGet'
import { imagesAnnotationSelection } from '../routes/imagesAnnotationSelection'
import { verifyToken } from './jwt-utils'
import { verify } from 'jsonwebtoken'
import handler from './handler-express'

const jwtHandler = async (c: Context, req, res) => {
    if(c.operation.operationId === 'login') {
        return
    }
    const auth = c.request.headers['authorization'] as string
    if(!auth) {
        res.status(401).json({
            message: 'No Auth Header'
        })
    }

    const verified = verifyToken(auth)

    if(!verified) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    const { payload } = verified
    
    return payload
}

export const makeApi = () => {
    const api = new OpenAPIBackend({ definition: './openapi.yaml', validate: true });
    api.register({
        notFound: (c, req, res: Response) => {
            console.log('not found', req.path)
            console.log('not found')
            res.status(404).json({ message: 'Not found' });
		},
        login: (c, req, res: Response) => {

            handler(login, c, res)
        },
        imagesGet: (c, req, res: Response) => {
            handler(imagesGet, c, res)
        },
        coordinatesGet: (c, req, res: Response) => {
            handler(coordinatesGet, c, res)
        },
        imagesAnnotationSelection: (c, req, res: Response) => {
            handler(imagesAnnotationSelection, c, res)
        }
    })
    api.registerSecurityHandler('bearerAuth', jwtHandler)
    
    api.init()
    return api
}

