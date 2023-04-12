import express, { Application } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors"
import { routes } from './routes'
import { logMiddleware } from './utils/logs'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

// configuration
let options = {
  explorer: true
};
dotenv.config();

// boot express
const app: Application = express();

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(logMiddleware)

// routes
app.use('/', routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

export default app