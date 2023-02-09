import { connect } from 'mongoose'
import makeServer from './utils/initialise-server'

const PORT = 3001 || process.env.PORT
const INIT_MESSAGE = 'App initialised'
const CONNECTION_URI = process.env.CONNECTION_URI

if(!CONNECTION_URI) throw new Error('CONNECTION_URI not set')

const app = makeServer()

connect(CONNECTION_URI)
  .then(() => { console.log('Connected to MongoDB at ', CONNECTION_URI) })

app.listen(PORT, () => {
  console.log('Port: ', PORT)
  console.log(INIT_MESSAGE)
})
