import { Response, Request } from 'express'
import { sign } from 'jsonwebtoken'
import { IUser } from 'models/user'

// signing the access token
export const createAccessToken = (id: string) => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET || 'very-secret-token', {
    expiresIn: 15 * 60
  })
}

// signing the refresh token
export const createRefreshToken = (id: string) => {
  return sign({ id }, process.env.REFRESH_TOKEN_SECRET || 'very-secret-token', {
    expiresIn: "90d"
  })
}

// sending the access token to the client
export const sendAccessToken = (req: Request, res: Response, accessToken: string) => {
  res.json({
    accessToken, message: "Sign in successful", type: 'success'
  })
}

// sending the refresh token to the client as a cookie
export const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true
  })
}

// password reset token
export const createPasswordResetToken = (user: IUser) => {
  const secret = user.password
  return sign({ id: user._id, email: user.email }, secret, {
    expiresIn: 15 * 60, // 15 minutes
  });
};