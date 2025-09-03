// app/api/translate/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { decode } from "html-entities"

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  const apiKey = process.env.GOOGLE_API_KEY // Use environment variable

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 })
  }

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: "fr" // Target language is French
      }
    )

    let translatedText = response.data.data.translations[0].translatedText
    translatedText = decode(translatedText)

    return NextResponse.json({ translated: translatedText })
  } catch (error) {
    console.error("Translation API Error:", error)
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    )
  }
}
