import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { errorHandler } from './utils/errorHandler.js';

//Routers
import userRouter from './routes/user.route.js';

const app = express();

//cors
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public')); // to store assets locally in server: img, vdo, pdf, doc, ..etc
app.use(cookieParser()); // cookie-parser

//Routes & middleware
app.use('/v1/user', userRouter);

app.use(errorHandler);
app.get('/', (req, res) => {
    return res.json({
        msg: 'It is working',
    });
});

export default app;
