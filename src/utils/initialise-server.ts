import express from 'express'
import { makeApi } from './initialise-api'
import type { Request } from 'openapi-backend';
import { connect } from 'mongoose';


const makeServer = (port: number, initMessage: string, connectionUri: string) => {
    const app = express()
    const api = makeApi()
    app.use(express.json())
    app.use((req, res) => {
        console.log(req.body)
        return api.handleRequest(req as Request, req, res)
    })

    connect(connectionUri)
        .then(() => console.log('Connected to MongoDB at ', connectionUri))

    app.listen(port, () => {
    console.log('Port: ', port)
    console.log(initMessage)
    })
    return app
}

export default makeServer
