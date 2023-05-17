import OpenAPIBackend, { type Context } from 'openapi-backend'
import { login } from '../routes/login'
import { imageGet } from '../routes/imageGet'
import { deleteRefreshToken } from '../routes/deleteRefreshToken'
import { type Response } from 'express'
import { verifyToken } from './jwt-utils'
import handler from './handler-express'
import { Boom } from '@hapi/boom'
import { userGet } from '../routes/userGet'
import { maskPost } from '../routes/maskPost'

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
    },
    getImage: (c, _, res: Response) => {
      handler(imageGet, c, res)
    },
    postMask: (c, _, res: Response) => {
      handler(maskPost, c, res)
    }
  })
  api.registerSecurityHandler('bearerAuth', jwtHandler)
  api.init()
  return api
}
