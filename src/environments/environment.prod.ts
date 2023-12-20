export const environment = {
    production: true,
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
    }
}



declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_KEY: string;
            AUTH_DOMAIN: string;
            DATABASE_URL: string;
            PROJECT_ID: string;
            STORAGE_BUCKET: string;
            MESSAGING_SENDER_ID: string;
            APP_ID: string;
        }
    }
}