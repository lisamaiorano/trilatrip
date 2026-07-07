import axios from "axios"


const API_URL = "http://localhost:3001"



export async function generateTrip(trip:any){

  const response = await axios.post(
    `${API_URL}/api/trip`,
    trip
  )


  return response.data

}