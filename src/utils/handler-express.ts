import { type Context } from 'openapi-backend'
import { type IRoute } from '../types/types'
import { type Response } from 'express'
import logger from './logger'

const handler = async (route: IRoute, c: Context, res: Response) => {
  const query = c.request.query
  const params = c.request.params
  const body = c.request.body
  const user = c.security.bearerAuth
  const req = { ...query, ...params, ...body }
  await route(user, req, res)

  logger.info({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    // result: res.son,
    status: res.statusCode
  })
}

export default handler
