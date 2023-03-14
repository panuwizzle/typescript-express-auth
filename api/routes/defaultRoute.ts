import { Router, Request, Response } from 'express'
import { compare, genSalt, hash } from 'bcryptjs'
import { verify } from 'jsonwebtoken'

export const defaultRoute = Router()

defaultRoute.get('/', async (req: Request, res: Response) => {
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTA1MmViYzExYmU4MmE4NjQ0YjI3NSIsImlhdCI6MTY3ODgwNTcwMCwiZXhwIjoxNjc4ODA5MzAwfQ.Ezou2L4y9IThR-5-p1ub6xnUkoNl72U8MflpXlUKc9k'
  let x = verify(token, process.env.ACCESS_TOKEN_SECRET!)
  console.log(x)
  res.send({ 'ok': 'ok' })
})