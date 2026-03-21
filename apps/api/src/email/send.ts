import { transporter, FROM_ADDRESS } from './index'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from:    FROM_ADDRESS,
      to,
      subject,
      html,
    })
    console.log(`Email sent to ${to}: ${info.messageId}`)
    return info
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err)
    throw err
  }
}