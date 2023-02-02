import { getAccessToken } from "../utils/jwt-utils";

export const TEST_TOKEN = getAccessToken({
    user_id: "email@email.com"
})