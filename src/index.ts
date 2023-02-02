import { connect } from 'mongoose'
import makeServer from './utils/initialise-server'
const PORT = 3001
const INIT_MESSAGE = 'App initialised'
const CONNECTION_URI = 'mongodb://localhost:27017/tnbc'


const app = makeServer()

connect(CONNECTION_URI)
    .then(() => console.log('Connected to MongoDB at ', CONNECTION_URI))

app.listen(PORT, () => {
    console.log('Port: ', PORT)
    console.log(INIT_MESSAGE)
})

