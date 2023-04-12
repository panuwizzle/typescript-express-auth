import express from 'express';
import dotenv from 'dotenv';
import { routes } from './routes'
import { logMiddleware } from './utils/logs'

dotenv.config();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
//app.use(cookieParser())
app.use(logMiddleware)
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

app.use('/', routes)

export default app