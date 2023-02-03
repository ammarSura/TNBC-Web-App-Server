import { Context } from "openapi-backend"
import { IRoute } from "../types/types"
import { Response } from "express"

const handler =  async (route: IRoute, c: Context, res: Response,) => {
    const query = c.request.query
    const params = c.request.params
    const body = c.request.body
    const user = c.security.bearerAuth
    const req = { ...query, ...params, ...body }

    await route(user, req, res)
}

export default handler