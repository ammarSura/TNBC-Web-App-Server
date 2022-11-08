import makeServer from './utils/initialise-server'
const PORT = 3000
const INIT_MESSAGE = 'App initialised'
const CONNECTION_URI = 'mongodb://localhost:27017/tnbc'

const app = makeServer(PORT, INIT_MESSAGE, CONNECTION_URI)

