import sgMail from '@sendgrid/mail'

const {
  SENDGRID_API_KEY = '',
  MAIL_FROM = 'info@piste-i.com',
  MAIL_TO = 'info@piste-i.com',
} = process.env

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const jsonResponse = (statusCode, payload = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    ...corsHeaders,
  },
  body: JSON.stringify(payload),
})

const renderAdminBody = (data) => `新規の無料相談予約がありました。

お名前: ${data.name}
メールアドレス: ${data.email}
店舗名: ${data.shop}
業態: ${data.industry}
ご希望の日程:
${data.preferred_dates}

相談したいこと:
${data.message || '（未入力）'}
`

const renderUserBody = (data) => `ご予約ありがとうございます。
担当者からの返信をお待ちください。

ご入力内容:
お名前: ${data.name}
店舗名: ${data.shop}
業態: ${data.industry}
ご希望の日程:
${data.preferred_dates}

相談したいこと:
${data.message || '（未入力）'}
`

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
    }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { message: 'Method Not Allowed' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return jsonResponse(400, { message: 'Invalid JSON payload.' })
  }

  if (!payload || typeof payload !== 'object') {
    return jsonResponse(400, { message: 'Invalid payload.' })
  }

  const required = ['name', 'email', 'shop', 'industry', 'preferred_dates']
  const missing = required.filter((field) => !payload[field])
  if (missing.length > 0) {
    return jsonResponse(400, { message: `Missing fields: ${missing.join(', ')}` })
  }

  if (!SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set')
    return jsonResponse(500, { message: 'Email service is not configured.' })
  }

  sgMail.setApiKey(SENDGRID_API_KEY)

  const adminMessage = {
    to: MAIL_TO,
    from: MAIL_FROM,
    subject: '【Review GPT】無料相談の新規予約',
    text: renderAdminBody(payload),
  }

  const userMessage = {
    to: payload.email,
    from: MAIL_FROM,
    subject: 'ご予約ありがとうございます',
    text: renderUserBody(payload),
  }

  try {
    await sgMail.send(adminMessage)
    await sgMail.send(userMessage)
  } catch (error) {
    console.error('Failed to send email', error)
    return jsonResponse(502, { message: 'メール送信に失敗しました。' })
  }

  return jsonResponse(200, { status: 'ok' })
}
