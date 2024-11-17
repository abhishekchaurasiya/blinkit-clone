import express from 'express';
import "dotenv/config"
import cors from 'cors'
import cookie_parser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import { connectDatabase } from './config/db.js';
import userRouter from "./routes/user.routes.js"

const PORT = process.env.PORT;

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookie_parser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))

app.use('/api/user', userRouter)


connectDatabase().then(()=>{
    app.listen(PORT, async () => {
        console.log(`Server is running on port ${PORT}`)
    })  
})
