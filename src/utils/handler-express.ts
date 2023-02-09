import { type Context } from 'openapi-backend'
import { JWTData, type IRoute } from '../types/types'
import { type Response } from 'express'
import logger from './logger'

const handler = async (route: IRoute, c: Context, res: Response) => {
  const query = c.request.query
  const params = c.request.params
  //path params
  const body = c.request.body
  const user: JWTData = c.security.bearerAuth
  const req = { ...query, ...params, ...body }
  const contextRequest = c.request
  const result: {[key: string]: any} = {
    method: contextRequest.method,
    path: contextRequest.path,
    query: Object.keys(query).length > 0 ? query : undefined,
    body: Object.keys(body).length > 0 ? body : undefined,
  }
  try {
    const response = await route(user, req, res)
    res.status(200).json(response)
    result.body = response
    result.statusCode = 200
  } catch(error) {
    if(error.isBoom) {
      res.status(error.output.statusCode).json({
        message: error.message
      })
      if(error.output.statusCode === 500) {
        logger.error(error)
      }
      result.errorMessage = error.message
      result.statusCode = error.output.statusCode
    }
  }
  logger.info(result)
}

export default handler
