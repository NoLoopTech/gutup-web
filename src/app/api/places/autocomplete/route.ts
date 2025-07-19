// app/api/places/autocomplete/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input")
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!input) {
    return NextResponse.json(
      { error: "Missing input parameter" },
      { status: 400 }
    )
  }

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 })
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input,
          key: apiKey
        }
      }
    )

    const suggestions = response.data.predictions.map((place: any) => ({
      label: place.description,
      value: place.place_id
    }))

    return NextResponse.json({ results: suggestions })
  } catch (error) {
    console.error("Places API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    )
  }
}
