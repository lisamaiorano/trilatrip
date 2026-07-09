export interface DayPlan {
  day: number
  title: string
  description: string
  activities: string[]
}

export interface Restaurant {
  name: string
  description: string
}

export interface BudgetBreakdown {
  accommodation: number
  food: number
  transport: number
  activities: number
  total: number
}

export interface TripItinerary {
  destination: string
  summary: string
  days: DayPlan[]
  restaurants: Restaurant[]
  tips: string[]
  packing: string[]
  budget: BudgetBreakdown
}

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
  rating?: string
}

export interface TripResponse {
  itinerary: TripItinerary | null
  raw?: string
  flights?: FlightOption[]
  hotels?: HotelOption[]
}
