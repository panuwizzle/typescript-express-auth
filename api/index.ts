import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { routes } from './routes'
import mongoose from 'mongoose'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI || '').then(() => {
  console.log('Mongo db')
})

app.use('/', routes)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
