export const environment = {
    production: true,
    firebaseConfig:{
        apiKey: "AIzaSyAbZrwolDiQP3vuY-LW8NMBJ4wmEDVR384",
        authDomain: "relearn-717b6.firebaseapp.com",
        databaseURL: "https://relearn-717b6-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "relearn-717b6",
        storageBucket: "relearn-717b6.appspot.com",
        messagingSenderId: "835984554782",
        appId: "1:835984554782:web:eb5e2271ea963bf6eb670f",
    }
    /* firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
    } */
}


/* 
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
} */