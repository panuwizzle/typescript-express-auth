import { IUser } from 'models/user';
import { createTransport } from 'nodemailer'

export const createPasswordResetUrl = (id: string, token: string) => `${process.env.CLIENT_URL}/reset-password/${id}/${token}`

export const transporter = createTransport({
  service: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORDs
  }
})

export const passwordResetTemplate = (user: IUser, url: string) => {
  const { email } = user;
  return {
    from: `Mail - <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reset Password`,
    html: `
        <h2>Password Reset Link</h2>
        <p>Reset your password by clicking on the link below:</p>
        <a href=${url}><button>Reset Password</button></a>
        <br />
        <br />
        <small><a style="color: #38A169" href=${url}>${url}</a></small>
        <br />
        <small>The link will expire in 15 mins!</small>
        <small>If you haven't requested password reset, please ignore!</small>
        <br /><br />
        <p>Thanks,</p>
        <p>Authentication API</p>`,
  };
};

export const passwordResetConfirmationTemplate = (user: IUser) => {
  const { email } = user;
  return {
    from: `Mail - <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Successful`,
    html: `
        <h2>Password Reset Successful</h2>
        <p>You've successfully updated your password for your account <${email}>. </p>
        <small>If you did not change your password, reset it from your account.</small>
        <br /><br />
        <p>Thanks,</p>
        <p>Authentication API</p>`,
  };
};