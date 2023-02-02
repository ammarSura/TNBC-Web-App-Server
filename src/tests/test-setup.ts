import { connect, connection } from "mongoose"

export const describeWrapper = async(test) => {
    beforeAll(async () => {
        await connect('mongodb://localhost:27017/tnbc-test')
    })
    test()

    afterAll(async () => {
        await connection.close()
    })
}