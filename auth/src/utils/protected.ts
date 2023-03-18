import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { User } from '../models/user'

export interface AuthorizedRequest extends Request {
  user?: object
}
interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
}
export const protectedRoute = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization']
  if (!authorization) {
    return res.status(500).json({
      message: "No token",
      type: "error"
    })
  }

  // Bearer AbCdEf....
  const [, token] = authorization.split(' ')
  try {
    let decoded = verify(token, process.env.ACCESS_TOKEN_SECRET!)
    const { id } = decoded as ITokenPayload


    if (!id) {
      return res.status(500).json({
        message: "Invalid token not id",
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

    req.user = user
    return next()
  } catch (error) {
    return res.status(500).json({
      message: "Invalid token! id 🤔",
      type: "error",
      error
    });
  }
}