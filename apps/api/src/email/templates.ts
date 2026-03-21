export function quoteReadyEmail(opts: {
  clientName: string
  eventName: string
  totalAmount: number
  quoteUrl: string
}) {
  return {
    subject: `Your quote is ready — ${opts.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="border-bottom: 3px solid #C17F3E; padding-bottom: 20px; margin-bottom: 28px;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #C17F3E; letter-spacing: 0.1em; text-transform: uppercase;">AV Portal</p>
        </div>

        <h1 style="font-size: 22px; color: #1E1C1A; margin: 0 0 8px;">Your quote is ready</h1>
        <p style="color: #8A8480; font-size: 14px; margin: 0 0 28px;">Hi ${opts.clientName},</p>

        <p style="color: #1E1C1A; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          Your quote for <strong>${opts.eventName}</strong> is ready for review.
          Please take a look and approve when you're happy, or let us know if anything needs adjusting.
        </p>

        <div style="background: #F7F4EF; border-radius: 10px; padding: 20px 24px; margin: 0 0 28px;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #8A8480; text-transform: uppercase; letter-spacing: 0.08em;">Quote total</p>
          <p style="margin: 0; font-size: 28px; font-weight: bold; color: #C17F3E;">$${opts.totalAmount.toLocaleString()}</p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #8A8480;">incl. GST</p>
        </div>

        <a href="${opts.quoteUrl}"
           style="display: inline-block; background: #C17F3E; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-size: 14px; font-weight: bold;">
          Review &amp; Approve Quote →
        </a>

        <p style="color: #8A8480; font-size: 12px; margin: 32px 0 0; line-height: 1.6;">
          If you have any questions, reply to this email and your account manager will be in touch.
        </p>

        <div style="border-top: 1px solid #EEEBE6; margin-top: 32px; padding-top: 20px;">
          <p style="margin: 0; font-size: 11px; color: #BDBAB6;">AV Portal · Client Portal</p>
        </div>
      </div>
    `
  }
}

export function quoteApprovedEmail(opts: {
  adminName: string
  clientName: string
  eventName: string
  totalAmount: number
  approvedAt: Date
}) {
  return {
    subject: `Quote approved — ${opts.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="border-bottom: 3px solid #3E7C6E; padding-bottom: 20px; margin-bottom: 28px;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #3E7C6E; letter-spacing: 0.1em; text-transform: uppercase;">AV Portal</p>
        </div>

        <h1 style="font-size: 22px; color: #1E1C1A; margin: 0 0 8px;">Quote approved ✓</h1>

        <p style="color: #1E1C1A; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          <strong>${opts.clientName}</strong> has approved the quote for <strong>${opts.eventName}</strong>.
        </p>

        <div style="background: #EAF3F1; border-radius: 10px; padding: 20px 24px; margin: 0 0 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-size: 13px; color: #8A8480; padding: 4px 0;">Event</td>
              <td style="font-size: 13px; color: #1E1C1A; font-weight: bold; text-align: right;">${opts.eventName}</td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: #8A8480; padding: 4px 0;">Total approved</td>
              <td style="font-size: 13px; color: #1E1C1A; font-weight: bold; text-align: right;">$${opts.totalAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: #8A8480; padding: 4px 0;">Approved at</td>
              <td style="font-size: 13px; color: #1E1C1A; font-weight: bold; text-align: right;">
                ${opts.approvedAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          </table>
        </div>

        <div style="border-top: 1px solid #EEEBE6; margin-top: 32px; padding-top: 20px;">
          <p style="margin: 0; font-size: 11px; color: #BDBAB6;">AV · Client Portal</p>
        </div>
      </div>
    `
  }
}

export function fileUploadedEmail(opts: {
  adminName: string
  clientName: string
  eventName: string
  fileName: string
  dashboardUrl: string
}) {
  return {
    subject: `New file uploaded — ${opts.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="border-bottom: 3px solid #C17F3E; padding-bottom: 20px; margin-bottom: 28px;">
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #C17F3E; letter-spacing: 0.1em; text-transform: uppercase;">AV Portal</p>
        </div>

        <h1 style="font-size: 22px; color: #1E1C1A; margin: 0 0 20px;">New file uploaded</h1>

        <p style="color: #1E1C1A; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
          <strong>${opts.clientName}</strong> has uploaded a file for <strong>${opts.eventName}</strong>.
        </p>

        <div style="background: #F7F4EF; border-radius: 10px; padding: 16px 20px; margin: 0 0 28px; display: flex; align-items: center; gap: 12px;">
          <p style="margin: 0; font-size: 14px; color: #1E1C1A;">📄 <strong>${opts.fileName}</strong></p>
        </div>

        <a href="${opts.dashboardUrl}"
           style="display: inline-block; background: #C17F3E; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-size: 14px; font-weight: bold;">
          View in Portal →
        </a>

        <div style="border-top: 1px solid #EEEBE6; margin-top: 32px; padding-top: 20px;">
          <p style="margin: 0; font-size: 11px; color: #BDBAB6;">AV Portal · Client Portal</p>
        </div>
      </div>
    `
  }
}