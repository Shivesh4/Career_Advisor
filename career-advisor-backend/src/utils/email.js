
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email, otp) {
  const mailOptions = {
    from: `"CareerHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your CareerHub account",
    html: `
      <h2>CareerHub Verification</h2>
      <p>Your verification code is:</p>
      <h3>${otp}</h3>
      <p>This code will expire in 10 minutes.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function sendResetPasswordEmail(email, otp) {
  const mailOptions = {
    from: `"CareerHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your CareerHub password",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP to reset your password is:</p>
      <h3>${otp}</h3>
      <p>This code expires in 10 minutes.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}
