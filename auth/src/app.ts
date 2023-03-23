import express from 'express';

import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { routes } from './routes'
import { logMiddleware } from './utils/logs'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

let options = {
  explorer: true,
};

dotenv.config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(logMiddleware)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

app.use('/', routes)

export default app