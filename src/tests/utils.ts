import { getAccessToken } from "../utils/jwt-utils";

export const TEST_TOKEN = getAccessToken({
    userId: "email@email.com"
})