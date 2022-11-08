import OpenAPIBackend from 'openapi-backend'
import { login } from '../routes/login'

export const makeApi = () => {
    const api = new OpenAPIBackend({ definition: './openapi.yaml' });
    api.register({
        login,
    })
    api.init()
    return api
}

