import { Schema, model } from "mongoose";

const userSchema = new Schema({
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

const User = model('User', userSchema)

export { User }