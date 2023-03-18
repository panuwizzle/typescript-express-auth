import { Router, Request, Response } from 'express'
import { compare, genSalt, hash } from 'bcryptjs'
import { verify } from 'jsonwebtoken'

export const defaultRoute = Router()

defaultRoute.get('/', async (req: Request, res: Response) => {
  res.send({ 'ok': 'ok' })
})