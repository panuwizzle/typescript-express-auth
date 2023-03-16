import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  verified: boolean;
  refreshToken: string;
}

export interface IUserRequestBody {
  email: string;
  password: string;
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

export async function createNewUser(userData: IUserRequestBody): Promise<IUser> {
  const user = new User(userData);
  return user.save();
}

export const User = model<IUser>('User', userSchema)
