import admin from 'firebase-admin'
import { initializeApp } from "firebase/app";
import serviceAccount from '../../test-auth-2bc3b-firebase-adminsdk-cqb6a-0bad906651.json'



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
})

export default admin.auth()