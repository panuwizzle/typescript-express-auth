import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { routes } from './routes'
import { logMiddleware } from './utils/logs'

dotenv.config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(logMiddleware)

app.use('/', routes)

export default app