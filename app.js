import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from "./src/router/index.js"
import errorMiddleware from './src/middlewares/error-middleware.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()