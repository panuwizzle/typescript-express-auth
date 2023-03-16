import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcryptjs'

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
    required: true,
    validate: {
      validator: (email: string) => {
        // Define a regular expression to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: (props: any) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    require: true,
    validate: {
      validator: (password: string) => {
        return password.length >= 8
      },
      message: () => `Password must be at less 8 characters`
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  }
})

userSchema.pre('save', async function (next) {
  try {
    await this.validate();

    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) {
      return next();
    }

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plaintext password with the hashed password
    this.password = hashedPassword;

    next();
  } catch (err:any) {
    next(err)
  }
});

export const User = model<IUser>('User', userSchema)
