import { connect } from 'mongoose'
import makeServer from './utils/initialise-server'
import logger from './utils/logger'

const PORT = 3001 || process.env.PORT
const INIT_MESSAGE = 'App initialised'
const CONNECTION_URI = process.env.CONNECTION_URI

if(!CONNECTION_URI) throw new Error('CONNECTION_URI not set')

const app = makeServer()

connect(CONNECTION_URI)
  .then(() => { 
    logger.info('Connected to database')
   })

app.listen(PORT, () => {
  logger.info(`Started server on port ${PORT}`)
  logger.info(INIT_MESSAGE)
})
