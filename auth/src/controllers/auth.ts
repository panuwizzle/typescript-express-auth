import { User, IUserRequestBody } from '../models/user'
import { Request, Response } from 'express'
import { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken, createPasswordResetToken, } from '../utils/token'
import { createPasswordResetUrl, passwordResetTemplate, transporter, passwordResetConfirmationTemplate } from '../utils/email'
import { compare, hash } from 'bcryptjs'
import { verify } from 'jsonwebtoken'
import { IAuthorizedRequest } from '../utils/protected'


export const signUp = async (req: Request<{}, {}, IUserRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    // tslint:disable-next-line:await-promise
    const user = await User.findOne({ email: email })

    if (user) {
      return res.status(500).json({
        message: "User already exists! Try logging in.",
        type: "warning"
      })
    }

    const newUser = new User({
      email: email,
      password: password
    })
    await newUser.save()

    res.status(201).json({
      message: "User created successfully",
      type: 'success',
      data: { email: newUser.email }
    })
  } catch (error: any) {
    res.status(400).json({
      type: "error",
      message: error.message,
    })
  }
}

export const signIn = async (req: Request<{}, {}, IUserRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body

    // tslint:disable-next-line:await-promise
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(500).json({
        message: "User doesn't exist",
        type: "error"
      })
    }

    const isMatch = compare(password, user.password)

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
}

export const signOut = (req: Request, res: Response) => {
  res.clearCookie('refreshToken')
  return res.json({
    message: "Logged out successfully",
    type: "success"
  })
}

export const refreshToken = async (req: Request, res: Response) => {
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

    // tslint:disable-next-line:await-promise
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
}

export const sendPasswordResetEmail = async (req: IAuthorizedRequest, res: Response) => {
  try {
    // get the user from the request body
    const { email } = req.body;
    // find the user by email
    const user = await User.findOne({ email });
    // if the user doesn't exist, return error
    if (!user)
      return res.status(500).json({
        message: "User doesn't exist! 😢",
        type: "error",
      });
    // create a password reset token
    const token = createPasswordResetToken(user);
    // create the password reset url
    const url = createPasswordResetUrl(user._id, token);
    // send the email
    const mailOptions = passwordResetTemplate(user, url);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res.status(500).json({
          message: "Error sending email! 😢",
          type: "error",
        });
      return res.json({
        message: "Password reset link has been sent to your email! 📧",
        type: "success",
      });
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error sending email!",
      error,
    });
  }
}

export const resetPassword = async (req: IAuthorizedRequest, res: Response) => {
  try {
    // get the user details from the url
    const { id, token } = req.params;
    // get the new password the request body
    const { newPassword } = req.body;
    // find the user by id
    const user = await User.findById(id);
    // if the user doesn't exist, return error
    if (!user)
      return res.status(500).json({
        message: "User doesn't exist! 😢",
        type: "error",
      });
    // verify if the token is valid
    const isValid = verify(token, user.password);
    // if the password reset token is invalid, return error
    if (!isValid)
      return res.status(500).json({
        message: "Invalid token! 😢",
        type: "error",
      });
    // set the user's password to the new password
    user.password = await hash(newPassword, 10);
    // save the user
    await user.save();
    // send the email
    const mailOptions = passwordResetConfirmationTemplate(user);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res.status(500).json({
          message: "Error sending email! 😢",
          type: "error",
        });
      return res.json({
        message: "Email sent! 📧",
        type: "success",
      });
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error sending email!",
      error,
    });
  }
}