import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  password: string;
  verified: boolean;
  refreshToken: string;
}
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  }
})

const User = model<IUser>('User', userSchema)

export { User }