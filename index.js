import dotenv from 'dotenv';
import { connectDB } from './src/DB/connectDB.js';
import app from './src/app.js';
dotenv.config({ path: '.env' });

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('App is listening to port', process.env.PORT);
        });
    })
    .catch((Err) => {
        console.log('--->Error in DB Connection:', Err);
    });
