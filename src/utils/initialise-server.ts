import express from 'express'
import { makeApi } from './initialise-api'
import type { Request } from 'openapi-backend';
import { connect } from 'mongoose';
import cors from 'cors'

const makeServer = () => {
    const app = express()
    const api = makeApi()
    app.use(express.json())
    app.use(cors())
    app.use((req, res) => {
        try {
            return api.handleRequest(req as Request, req, res, true)
        } catch(e) {
            console.log(e)
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
       
    })
    return app
}

export default makeServer
