import { createHash } from "crypto"

const TP_TOKEN = process.env.TRAVELPAYOUTS_TOKEN ?? ""
const TP_MARKER = process.env.TRAVELPAYOUTS_MARKER ?? ""

const AUTOCOMPLETE_URL = "https://autocomplete.travelpayouts.com/places2"
const FLIGHTS_BASE_URL = "https://api.travelpayouts.com"
const HOTELS_BASE_URL = "http://engine.hotellook.com/api/v2"

export interface FlightOption {
  airline: string
  price: number
  currency: string
  departure: string
  arrival: string
  duration: string
  stops: number
}

export interface HotelOption {
  name: string
  price: number
  currency: string
  rating?: number
}

interface CityMatch {
  code: string
}

async function resolveCity(query: string): Promise<CityMatch | null> {

  const url = `${AUTOCOMPLETE_URL}?term=${encodeURIComponent(query)}&locale=en&types[]=city`

  const response = await fetch(url)

  if (!response.ok) return null

  const results = await response.json()

  if (!Array.isArray(results) || results.length === 0) return null

  const best = results.reduce((a: any, b: any) => (b.weight > a.weight ? b : a))

  return { code: best.code }
}

// ---- Flights: Aviasales v1 flight_search ----
// Signature algorithm verified against Travelpayouts' own JS client (lib/signature.js):
// recursively walk the request body (object keys sorted alphabetically, arrays in order),
// append ":value" for every leaf, then md5(token + that string).

function flightSignatureString(value: unknown): string {

  if (Array.isArray(value)) {
    return value.map(flightSignatureString).join("")
  }

  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .map((key) => flightSignatureString((value as Record<string, unknown>)[key]))
      .join("")
  }

  return `:${value}`
}

function flightSignature(params: Record<string, unknown>): string {
  return createHash("md5").update(TP_TOKEN + flightSignatureString(params)).digest("hex")
}

export async function searchFlights({
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
}: {
  origin: string
  destination: string
  departureDate: string
  returnDate: string
  adults: number
}): Promise<FlightOption[]> {

  if (!TP_TOKEN || !TP_MARKER) {
    throw new Error("Travelpayouts credentials are not configured")
  }

  const [originCity, destinationCity] = await Promise.all([
    resolveCity(origin),
    resolveCity(destination),
  ])

  if (!originCity || !destinationCity) return []

  const segments = [
    { origin: originCity.code, destination: destinationCity.code, date: departureDate },
  ]

  if (returnDate) {
    segments.push({ origin: destinationCity.code, destination: originCity.code, date: returnDate })
  }

  const body: Record<string, unknown> = {
    marker: TP_MARKER,
    host: "trilatrip.local",
    user_ip: "127.0.0.1",
    locale: "en",
    trip_class: "Y",
    passengers: { adults: Math.max(1, adults || 1), children: 0, infants: 0 },
    segments,
    know_english: "false",
    currency: "eur",
  }

  const signedBody = { ...body, signature: flightSignature(body) }

  const initResponse = await fetch(`${FLIGHTS_BASE_URL}/v1/flight_search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signedBody),
  })

  if (!initResponse.ok) {
    throw new Error(`Travelpayouts flight_search failed with ${initResponse.status}`)
  }

  const initData = await initResponse.json()
  const searchId = initData.search_id

  if (!searchId) return []

  const deadline = Date.now() + 10000
  const chunks: any[] = []

  while (Date.now() < deadline) {

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const resultsResponse = await fetch(`${FLIGHTS_BASE_URL}/v1/flight_search_results?uuid=${searchId}`)

    if (!resultsResponse.ok) continue

    const chunk = await resultsResponse.json()

    if (!Array.isArray(chunk) || chunk.length === 0) continue

    chunks.push(...chunk)

    const last = chunk[chunk.length - 1]

    if (last?.search_id && !last?.meta) break
  }

  return extractFlightOptions(chunks)
}

function extractFlightOptions(chunks: any[]): FlightOption[] {

  const options: FlightOption[] = []

  for (const gate of chunks) {

    try {
      const proposals = gate.proposals ?? []
      const legs = gate.segment?.[0] ?? gate.segments?.[0] ?? []

      const firstLeg = legs[0]
      const lastLeg = legs[legs.length - 1]

      if (!firstLeg || !lastLeg) continue

      for (const proposal of proposals) {

        const terms: Record<string, any> = proposal.terms ?? {}
        const cheapest = Object.values(terms).sort(
          (a: any, b: any) => (a.price ?? Infinity) - (b.price ?? Infinity)
        )[0] as any

        if (!cheapest) continue

        options.push({
          airline: proposal.carriers?.[0] ?? firstLeg.marketing_carrier ?? firstLeg.operating_carrier ?? "?",
          price: cheapest.price,
          currency: cheapest.currency ?? "EUR",
          departure: firstLeg.departure ?? firstLeg.local_departure_timestamp ?? "",
          arrival: lastLeg.arrival ?? lastLeg.local_arrival_timestamp ?? "",
          duration: String(proposal.duration ?? gate.duration ?? ""),
          stops: Math.max(0, legs.length - 1),
        })
      }
    } catch {
      // skip malformed gate entries rather than fail the whole search
      continue
    }
  }

  return options.sort((a, b) => a.price - b.price).slice(0, 5)
}

// ---- Hotels: Hotellook search/start.json + search/getResult.json ----
// Signature algorithm verified against Travelpayouts' Go client (hotellook.go withSignature):
// md5(token + ":" + marker + ":" + values of params sorted by key, joined by ":").

function hotelSignature(params: Record<string, string>): string {

  const keys = Object.keys(params).sort()

  let src = `${TP_TOKEN}:${TP_MARKER}`

  for (const key of keys) {
    src += `:${params[key]}`
  }

  return createHash("md5").update(src).digest("hex")
}

function buildHotelUrl(path: string, params: Record<string, string>): string {

  const url = new URL(`${HOTELS_BASE_URL}${path}`)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  url.searchParams.set("marker", TP_MARKER)
  url.searchParams.set("signature", hotelSignature(params))

  return url.toString()
}

export async function searchHotels({
  city,
  checkInDate,
  checkOutDate,
  adults,
}: {
  city: string
  checkInDate: string
  checkOutDate: string
  adults: number
}): Promise<HotelOption[]> {

  if (!TP_TOKEN || !TP_MARKER) {
    throw new Error("Travelpayouts credentials are not configured")
  }

  const cityInfo = await resolveCity(city)

  if (!cityInfo) return []

  const startParams: Record<string, string> = {
    iata: cityInfo.code,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    adultsCount: String(Math.max(1, adults || 1)),
    childrenCount: "0",
    lang: "en",
    currency: "eur",
    customerIp: "127.0.0.1",
  }

  const startResponse = await fetch(buildHotelUrl("/search/start.json", startParams))

  if (!startResponse.ok) {
    throw new Error(`Travelpayouts hotel search/start failed with ${startResponse.status}`)
  }

  const startData = await startResponse.json()
  const searchId = startData.searchId

  if (!searchId) return []

  const deadline = Date.now() + 10000
  let results: any[] = []

  while (Date.now() < deadline) {

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const resultParams: Record<string, string> = { searchId: String(searchId), limit: "5" }

    const resultResponse = await fetch(buildHotelUrl("/search/getResult.json", resultParams))

    if (!resultResponse.ok) continue

    const data = await resultResponse.json()

    if (Array.isArray(data?.result) && data.result.length > 0) {
      results = data.result
      break
    }
  }

  return results.slice(0, 5).map((hotel: any) => ({
    name: hotel.name,
    price: hotel.price ?? hotel.minPriceTotal ?? 0,
    currency: "EUR",
    rating: hotel.stars,
  }))
}
