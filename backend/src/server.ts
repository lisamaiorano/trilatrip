import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import { searchFlights, searchHotels } from "./travelpayouts.js"

dotenv.config()
const app = express()

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434"
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2"

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {

  res.json({
    message: "TrilaTrip API running 🚀"
  })

})


async function generateItinerary(prompt: string) {

  const ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      format: "json",
      options: {
        num_predict: 4096,
        num_ctx: 8192,
        temperature: 0.8,
      },
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  })

  if (!ollamaResponse.ok) {
    throw new Error(`Ollama responded with ${ollamaResponse.status}`)
  }

  const data = await ollamaResponse.json()
  const content = data.message?.content ?? ""

  try {
    return { itinerary: JSON.parse(content) }
  } catch {
    return { itinerary: null, raw: content }
  }
}


app.post("/api/trip", async (req, res) => {

  const {
    destination,
    departureCity,
    days,
    startDate,
    endDate,
    adults,
    children,
    budget,
    budgetLevel,
    accommodation,
    interests,
    pace,
    foodPreferences,
    accessibility,
    tripType,
    notes,
  } = req.body


  const prompt = `
You are a professional travel consultant known for rich, specific, non-generic itineraries. Create a detailed ${days}-day travel itinerary.

Trip details:
- Destination: ${destination}
- Departure city: ${departureCity}
- Duration: ${days} days
- Travelers: ${adults} adults${children ? `, ${children} children` : ""} (${tripType} trip)
- Budget: ${budgetLevel} level, total €${budget}
- Accommodation preference: ${accommodation}
- Pace: ${pace}
- Interests: ${interests?.length ? interests.join(", ") : "no specific preference"}
- Food preferences: ${foodPreferences?.length ? foodPreferences.join(", ") : "no specific preference"}
- Accessibility needs: ${accessibility?.length ? accessibility.join(", ") : "none"}
- Extra notes: ${notes || "none"}

Requirements for detail and quality:
- Use real, specific place names (real neighborhoods, real landmarks, real streets) instead of generic descriptions.
- Each day's "description" must be at least 3 sentences.
- Each day must have at least 5 "activities", each written as "HH:MM – action" with a real place name and a short reason why it's worth it.
- Include at least 5 restaurants with a 1-2 sentence description each, mentioning a signature dish.
- Include at least 6 local tips (practical, specific, not generic advice like "bring a camera").
- Include at least 8 packing items relevant to the destination and season.

Return ONLY a valid JSON object with this exact structure, no markdown, no code fences, no extra text:

{
  "destination": string,
  "summary": string (2-3 sentence overview of the trip),
  "days": [
    { "day": number, "title": string, "description": string, "activities": string[] }
  ],
  "restaurants": [
    { "name": string, "description": string }
  ],
  "tips": string[],
  "packing": string[],
  "budget": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number,
    "total": number
  }
}

The "days" array must contain exactly ${days} entries. Budget numbers are in euros and should roughly sum to the total budget.
`


  const [itinerarySettled, flightsSettled, hotelsSettled] = await Promise.allSettled([
    generateItinerary(prompt),
    searchFlights({
      origin: departureCity,
      destination,
      departureDate: startDate,
      returnDate: endDate,
      adults,
    }),
    searchHotels({
      city: destination,
      checkInDate: startDate,
      checkOutDate: endDate,
      adults,
    }),
  ])

  if (itinerarySettled.status === "rejected") {

    console.error("Ollama request failed:", itinerarySettled.reason)

    res.status(502).json({
      error: "Could not reach Ollama. Make sure it's running (`ollama serve`) and the model is pulled (`ollama pull " + OLLAMA_MODEL + "`)."
    })

    return
  }

  if (flightsSettled.status === "rejected") {
    console.warn("Flight search skipped:", flightsSettled.reason?.message ?? flightsSettled.reason)
  }

  if (hotelsSettled.status === "rejected") {
    console.warn("Hotel search skipped:", hotelsSettled.reason?.message ?? hotelsSettled.reason)
  }

  res.json({
    ...itinerarySettled.value,
    flights: flightsSettled.status === "fulfilled" ? flightsSettled.value : [],
    hotels: hotelsSettled.status === "fulfilled" ? hotelsSettled.value : [],
  })

})


app.listen(3001, () => {

  console.log(
    "🚀 TrilaTrip API running on port 3001"
  )

})
