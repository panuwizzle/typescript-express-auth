import Router, { Request, Response } from 'express'
import { compare, genSalt, hash } from 'bcryptjs'
import { verify } from 'jsonwebtoken'
import { User, createNewUser, IUserRequestBody } from '../models/user'
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } from '../utils/token'
import { AuthorizedRequest, protectedRoute } from '../utils/protected'

export const authRouter = Router()

authRouter.post('/signup', async (req: Request<{}, {}, IUserRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)

    const user = await User.findOne({ email: email })

    if (user) {
      return res.status(500).json({
        message: "User already exists! Try logging in.",
        type: "warning"
      })
    }
    const salt = await genSalt(10)
    const passwordHash = await hash(password, salt)

    const newUser = createNewUser({
      email: email,
      password: passwordHash
    })

    console.log(newUser)

    res.status(200).json({
      message: "User created successfully",
      type: 'success'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      type: "error",
      message: "Error creating user",
      error,
    })
  }
})

authRouter.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(500).json({
        message: "User doesn't exist",
        type: "error"
      })
    }

    const isMatch = compare(password, user.password!)

    if (!isMatch) {
      return res.status(500).json({
        message: "Password is incorrect",
        type: "error"
      })
    }

    const accessToken = createAccessToken(user._id.toString())
    const refreshToken = createRefreshToken(user._id.toString())

    user.refreshToken = refreshToken
    await user.save()

    sendRefreshToken(res, refreshToken)
    sendAccessToken(req, res, accessToken)
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error signing in!",
      error,
    })
  }
})

authRouter.post('/signout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken')
  return res.json({
    message: "Logged out successfully",
    type: "success"
  })
})

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      return res.status(500).json({
        message: "No refresh token!",
        type: "error"
      })
    }
    let id
    try {
      id = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "very-secret-token")
      console.log(id)
    } catch (error) {
      return res.status(500).json({
        message: "Invalid refresh token",
        type: "error"
      })
    }

    if (!id) {
      return res.status(500).json({
        message: "Invalid refresh token",
        type: "error"
      })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(500).json({
        message: "User doesn't exist",
        type: "error"
      })
    }
    console.log(user)
    if (user.refreshToken !== refreshToken) {
      return res.status(500).json({
        message: "Invalid refresh token",
        type: "error"
      })
    }

    const accessToken = createAccessToken(user._id.toString())
    user.refreshToken = createRefreshToken(user._id.toString())

    sendRefreshToken(res, refreshToken)

    return res.json({
      message: "Refreshed successfully",
      type: "success",
      accessToken
    })
  } catch (error) {
    return res.status(400).json({
      message: "Error refreshing token",
      type: "error",
      error
    })
  }
})

// sameple route with protectedRoute middleware
authRouter.get('/protected', protectedRoute, async (req: AuthorizedRequest, res: Response) => {
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