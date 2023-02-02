import { Context } from "openapi-backend"
import { IRoute } from "../types/types"
import { Response } from "express"

const handler =  async (route: IRoute, c: Context, res: Response,) => {
    const query = c.request.query
    const params = c.request.params
    const user = c.security.bearerAuth

    await route(user, { ...query, ...params }, res)
}

export default handler