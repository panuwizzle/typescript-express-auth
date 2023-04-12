import Router from 'express'
import { signUp, signIn, signOut, refreshToken, sendPasswordResetEmail, resetPassword } from '../controllers/auth'

export const authRouter = Router()

authRouter.post('/signup', signUp)

authRouter.post('/signin', signIn)

authRouter.post('/signout', signOut)

authRouter.post('/refresh-token', refreshToken)

// send password reset email
authRouter.post("/send-password-reset-email", sendPasswordResetEmail);

// reset password
authRouter.post("/reset-password/:id/:token", resetPassword);