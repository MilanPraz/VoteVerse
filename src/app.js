import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { errorHandler } from './utils/errorHandler.js';

//Routers
import userRouter from './routes/user.route.js';
import candidateRouter from './routes/candidate.route.js';

const app = express();

//cors
// CORS configuration
// const corsOptions = {
//     origin: 'http://localhost:5173', // Allow your frontend origin
//     credentials: true, // Allow cookies to be sent
// };

// Apply CORS middleware
app.use(cors());
// app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public')); // to store assets locally in server: img, vdo, pdf, doc, ..etc
app.use(cookieParser()); // cookie-parser

//Routes & middleware
app.use('/v1/user', userRouter);
app.use('/v1/candidate', candidateRouter);

//global error handler triggered by next
app.use(errorHandler);
app.get('/', (req, res) => {
    const refresh_token = req.cookies.refreshToken;
    console.log('Refresh TOKEN Xa??', refresh_token);

    return res.json({
        msg: 'It is working',
    });
});

export default app;
