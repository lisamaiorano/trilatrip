import axios from "axios"
import type { TripResponse } from "../types/itinerary"


const API_URL = "http://localhost:3001"



export async function generateTrip(trip: Record<string, unknown>): Promise<TripResponse> {

  const response = await axios.post(
    `${API_URL}/api/trip`,
    trip
  )


  return response.data

}