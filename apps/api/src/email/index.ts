import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'localhost',
  port:   parseInt(process.env.SMTP_PORT ?? '1025'),
  secure: false,
  auth:   process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  } : undefined,
})

export const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'portal@av-portal.com.au'