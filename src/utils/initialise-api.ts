import OpenAPIBackend, { type Context } from 'openapi-backend'
import { login } from '../routes/login'
import { imagesGet } from '../routes/imagesGet'
import { deleteRefreshToken } from '../routes/deleteRefreshToken'
import { type Response } from 'express'
import { coordinatesGet } from '../routes/coordinatesGet'
import { imagesAnnotationSelection } from '../routes/imagesAnnotationSelection'
import { verifyToken } from './jwt-utils'
import handler from './handler-express'
import { Boom } from '@hapi/boom'
import { userGet } from '../routes/userGet'
import logger from './logger'

const jwtHandler = async (c: Context, req, res) => {
  const auth = c.request.headers.authorization as string
  if (!auth) {
    throw new Boom('No authorization header', { statusCode: 400 }) 
  }
  const verified = verifyToken(auth)

  if (!verified) {
    throw new Boom('Unauthorized', { statusCode: 401 })
  }
  const { payload } = verified
  return payload
}

export const makeApi = () => {
  const api = new OpenAPIBackend({ definition: './openapi.yaml' })
  api.register({
    notFound: (c, req, res: Response) => {
      res.status(404).json({ message: 'Not Found' })
    },
    login: (c, _, res: Response) => {
      handler(login, c, res)
    },
    deleteRefreshToken: (c, _, res: Response) => {
      handler(deleteRefreshToken, c, res)
    },
    getUser: (c, _, res: Response) => {
      handler(userGet, c, res)
    }
  })
  api.registerSecurityHandler('bearerAuth', jwtHandler)
  api.init()
  return api
}
