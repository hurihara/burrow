import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuth } from 'google-auth-library'

export async function POST(req: NextRequest) {
  const { token, title, body } = await req.json()

  const auth = new GoogleAuth({
    credentials: {
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  })

  const accessToken = await auth.getAccessToken()

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token,
          data: { title, body },  // ← ここだけ変更
        },
      }),
    }
  )

  const data = await res.json()
  return NextResponse.json(data)
}
