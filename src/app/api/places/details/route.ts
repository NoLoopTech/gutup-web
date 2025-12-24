// app/api/places/details/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId")
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 })
  }

  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId" }, { status: 400 })
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: apiKey
        }
      }
    )

    const result = response.data.result

    const { name, address_components } = response.data.result

    // Extract city (locality, postal_town for UK/Sweden, or sublocality_level_1 for NYC)
    const city =
      address_components.find(
        (c: { types: string[] }) =>
          c.types.includes("locality") ||
          c.types.includes("postal_town") ||
          c.types.includes("sublocality_level_1")
      )?.long_name || ""

    // Extract country
    const country =
      address_components.find((c: { types: string[] }) =>
        c.types.includes("country")
      )?.long_name || ""

    const lat = result.geometry?.location?.lat || null
    const lng = result.geometry?.location?.lng || null

    return NextResponse.json({
      location: {
        name,
        city,
        country,
        lat,
        lng
      }
    })
  } catch (error) {
    console.error("Google Places Details API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch location details" },
      { status: 500 }
    )
  }
}
