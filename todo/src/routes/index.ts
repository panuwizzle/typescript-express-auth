import { Router, Request, Response } from 'express'

import { todoRouter } from './todo';

export const routes = Router()

routes.get('/', async (req: Request, res: Response) => {
  res.send("todo api")
})
routes.use('/todos', todoRouter)