import { Link, useLocation } from "react-router-dom"
import {
  Calendar,
  Utensils,
  Lightbulb,
  Luggage,
  Wallet,
  MapPin,
  Plane,
  Hotel,
} from "lucide-react"
import type { FlightOption, HotelOption, TripItinerary } from "../types/itinerary"

function formatDateTime(iso: string) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDuration(iso: string) {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(iso ?? "")
  if (!match) return iso
  const hours = match[1] ? `${match[1]}h` : ""
  const minutes = match[2] ? `${match[2]}m` : ""
  return [hours, minutes].filter(Boolean).join(" ") || iso
}

type ResultState = {
  itinerary?: TripItinerary | null
  raw?: string
  flights?: FlightOption[]
  hotels?: HotelOption[]
}

function TripResult() {

  const location = useLocation()

  const state = location.state as ResultState | null

  if (!state || (!state.itinerary && !state.raw)) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow">
          <h1 className="text-3xl font-bold">No trip to show yet</h1>

          <p className="mt-3 text-gray-500">
            Start by creating a new trip and we'll plan it for you.
          </p>

          <Link
            to="/new-trip"
            className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            New trip
          </Link>
        </div>
      </div>
    )
  }

  const trip = state.itinerary

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TrilaTrip ✈️
          </Link>

          <div className="flex gap-3">
            <Link to="/dashboard" className="rounded-full border border-blue-600 px-5 py-2 text-blue-600">
              Dashboard
            </Link>

            <Link to="/new-trip" className="rounded-full bg-blue-600 px-5 py-2 text-white">
              New trip
            </Link>
          </div>
        </div>

        {!trip ? (
          <RawFallback raw={state.raw ?? ""} />
        ) : (
          <>
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" size={32} />
              <h1 className="text-4xl font-bold">{trip.destination}</h1>
            </div>

            {trip.summary && (
              <p className="mt-4 text-lg text-gray-600">{trip.summary}</p>
            )}

            {((state.flights?.length ?? 0) > 0 || (state.hotels?.length ?? 0) > 0) && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">

                {(state.flights?.length ?? 0) > 0 && (
                  <Section icon={Plane} title="Flights">
                    <ul className="space-y-4">
                      {state.flights!.map((flight, i) => (
                        <li key={i} className="border-b border-gray-100 pb-3 last:border-none last:pb-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{flight.airline}</p>
                            <p className="font-semibold text-blue-600">
                              {flight.price} {flight.currency}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(flight.departure)} → {formatDateTime(flight.arrival)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDuration(flight.duration)} · {flight.stops === 0 ? "direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {(state.hotels?.length ?? 0) > 0 && (
                  <Section icon={Hotel} title="Hotels">
                    <ul className="space-y-4">
                      {state.hotels!.map((hotel, i) => (
                        <li key={i} className="border-b border-gray-100 pb-3 last:border-none last:pb-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{hotel.name}</p>
                            <p className="font-semibold text-blue-600">
                              {hotel.price} {hotel.currency}
                            </p>
                          </div>
                          {hotel.rating && (
                            <p className="text-sm text-gray-500">{hotel.rating}★</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

              </div>
            )}

            {trip.days?.length > 0 && (
              <div className="mt-8 grid gap-6">
                {trip.days.map((day) => (
                  <div key={day.day} className="rounded-3xl bg-white p-6 shadow">
                    <div className="flex items-center gap-3 text-blue-600">
                      <Calendar />
                      <h3 className="font-bold">Day {day.day}</h3>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold">{day.title}</h2>

                    <p className="mt-3 text-gray-600">{day.description}</p>

                    {day.activities?.length > 0 && (
                      <ul className="mt-4 list-inside list-disc space-y-1 text-gray-600">
                        {day.activities.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 grid gap-6 sm:grid-cols-2">

              {trip.restaurants?.length > 0 && (
                <Section icon={Utensils} title="Restaurants to try">
                  <ul className="space-y-3">
                    {trip.restaurants.map((restaurant, i) => (
                      <li key={i}>
                        <p className="font-semibold">{restaurant.name}</p>
                        <p className="text-sm text-gray-600">{restaurant.description}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {trip.tips?.length > 0 && (
                <Section icon={Lightbulb} title="Local tips">
                  <ul className="list-inside list-disc space-y-1 text-gray-600">
                    {trip.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {trip.packing?.length > 0 && (
                <Section icon={Luggage} title="Packing list">
                  <ul className="list-inside list-disc space-y-1 text-gray-600">
                    {trip.packing.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {trip.budget && (
                <Section icon={Wallet} title="Budget breakdown">
                  <div className="space-y-2 text-gray-600">
                    <BudgetRow label="Accommodation" value={trip.budget.accommodation} />
                    <BudgetRow label="Food" value={trip.budget.food} />
                    <BudgetRow label="Transport" value={trip.budget.transport} />
                    <BudgetRow label="Activities" value={trip.budget.activities} />
                    <div className="mt-2 flex justify-between border-t pt-2 font-bold text-gray-900">
                      <span>Total</span>
                      <span>€{trip.budget.total}</span>
                    </div>
                  </div>
                </Section>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Utensils
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <div className="flex items-center gap-3 text-blue-600">
        <Icon size={20} />
        <h3 className="font-bold">{title}</h3>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  )
}

function BudgetRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>€{value}</span>
    </div>
  )
}

function RawFallback({ raw }: { raw: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Your AI itinerary ✨</h1>

      <p className="mt-2 text-sm text-amber-600">
        We couldn't structure this trip automatically, here's the raw plan instead.
      </p>

      <div className="mt-6 whitespace-pre-line rounded-3xl bg-white p-6 text-gray-700 shadow">
        {raw}
      </div>
    </div>
  )
}

export default TripResult
