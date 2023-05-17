import { connect, connection } from "mongoose"
import User from "../schemas/User"
import { getAdminUser } from "./utils"

export const describeWrapper = async(suiteName: string, childTests: () => void) => {
    describe(suiteName, () => {
        beforeAll(async () => {
            await connect('mongodb://localhost:27017/tnbc-test')
        })    

        childTests()

        afterAll(async () => {  
            await connection.close()
        })
    })
}

export default describeWrapper