// lib/api/location.ts

export interface LocationDetails {
  name: string
  city: string
  country: string
  lat: number
  lng: number
}

export async function getLocationDetails(
  placeId: string
): Promise<LocationDetails | null> {
  try {
    const res = await fetch(`/api/places/details?placeId=${placeId}`)

    if (!res.ok) {
      console.error(`API error: ${res.statusText}`)
      return null
    }

    const data = await res.json()

    if (!data.location) {
      console.error("Invalid API response format")
      return null
    }

    return data.location
  } catch (error) {
    console.error("Failed to fetch location details:", error)
    return null
  }
}
