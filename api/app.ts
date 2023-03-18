import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { routes } from './routes'

dotenv.config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use('/', routes)

export default app