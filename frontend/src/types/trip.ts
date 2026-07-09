export type BudgetLevel =
  | "economy"
  | "comfort"
  | "luxury"

export type Pace =
  | "relaxed"
  | "balanced"
  | "intensive"

export type Accommodation =
  | "hotel"
  | "airbnb"
  | "hostel"
  | "resort"

export type TripType =
  | "solo"
  | "couple"
  | "family"
  | "friends"

export interface TripRequest {

  destination: string

  departureCity: string

  startDate: string

  endDate: string

  adults: number

  children: number

  childrenAges: number[]

  budget: number

  budgetLevel: BudgetLevel

  accommodation: Accommodation

  transport: string[]

  interests: string[]

  pace: Pace

  foodPreferences: string[]

  accessibility: string[]

  tripType: TripType

  notes: string

}