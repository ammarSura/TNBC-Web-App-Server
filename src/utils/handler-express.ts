import { type Context } from 'openapi-backend'
import { JWTData, type IRoute } from '../types/types'
import { type Response } from 'express'
import logger from './logger'
import { Boom } from '@hapi/boom'
import { randomUUID } from 'crypto'

const handler = async (route: IRoute, c: Context, res: Response) => {
  const query = c.request.query
  const params = c.request.params
  //path params
  const body = c.request.body
  const req = { ...query, ...params, ...body }
  const contextRequest = c.request
  
  const result: {[key: string]: any} = {
    method: contextRequest.method,
    path: contextRequest.path,
    query: Object.keys(query).length > 0 ? query : undefined,
    body: Object.keys(body).length > 0 ? body : undefined,
    requestId: randomUUID()
  }
  
  logger.info({
    result,
    messaage: 'Request received',
  })

  const { authorized, bearerAuth } = c.security
    if(!authorized && bearerAuth) {
      const { statusCode, message } = bearerAuth.error.output
      res.status(statusCode).json({ message })
      result.statusCode = statusCode
      result.errorMessage = message
    } else {
      const { valid, errors } = c.api.validateRequest(c.request)
      if(!valid) {
        const message = errors?.map((error: any) => error.message).join(', ')
        res.status(400).json({ message })
        result.statusCode = 400
        result.errorMessage = message
      } else {
        try {
          const response = await route(bearerAuth as JWTData, req, res)
          res.status(200).json(response)
          result.body = response
          result.statusCode = 200
          if(process.env.NODE_ENV === 'test') {
            try {
              const {valid, errors} = c.api.validateResponse(response, c.operation, 200)
            } catch(error) {
              logger.error(error)
            }
          }
        } catch(error) {
          if(error.isBoom) {
            res.status(error.output.statusCode).json({
              message: error.message
          })
            result.errorMessage = error.message
            result.statusCode = error.output.statusCode
          } else {
            result.errorMessage = 'Internal Server Error'
            result.statusCode = 500
            logger.error(error)
            res.status(500).json({
              message: 'Internal Server Error'
            })
          }
        }
      }
    }

  

  
  logger.info(result)
}

export default handler
