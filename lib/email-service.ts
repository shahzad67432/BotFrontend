"use server"
import nodemailer, { SendMailOptions } from 'nodemailer'
const smtpTransport = require('nodemailer-smtp-transport');

interface EmailOptions {
  to: string
  subject: string
  text: string
  html: string
}

const transporter = nodemailer.createTransport(smtpTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secureConnection: false,
//   secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true, 
  logger: true, 
}));


export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  const mailOptions: SendMailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    text,
    html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully', info)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}



// import nodemailer from "nodemailer"
// export const transporter = nodemailer.createTransport({
//     host: "smtp.mandrillapp.com",
//     port: 587,
//     auth: {
//       user: process.env.MAILCHIMP_USERNAME,
//       pass: process.env.MAILCHIMP_API_KEY
//     }
//   })