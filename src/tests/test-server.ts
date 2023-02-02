import makeServer from '../utils/initialise-server'
const PORT = 3001
const INIT_MESSAGE = 'Test app initialised'
const DB_NAME = 'tnbc-test'
const CONNECTION_URI = `mongodb://localhost:27017/${DB_NAME}`

const app = makeServer()

export default app