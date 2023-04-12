import { Router, Request, Response } from 'express'
import { IAuthorizedRequest, protectedRoute } from '../utils/protected'

export const defaultRoute = Router()

defaultRoute.get('/', async (req: Request, res: Response) => {
  res.send({ 'ok': 'ok' })
})

// sameple route with protectedRoute middleware
defaultRoute.get('/protected', protectedRoute, async (req: IAuthorizedRequest, res: Response) => {
  try {
    if (req.user) {
      return res.json({
        message: "You are logged in",
        type: "success",
        user: req.user
      })
    }
    return res.status(500).json({
      message: "Not login",
      type: "error"
    })
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error getting protected route",
      error
    })
  }
})