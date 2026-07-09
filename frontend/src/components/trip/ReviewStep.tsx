import { MapPin, Plane, Calendar, Users, Wallet, Compass } from "lucide-react"
import type { TripRequest } from "../../types/trip"

type Props = {
  trip: TripRequest
}

function countNights(startDate: string, endDate: string) {

  if (!startDate || !endDate) return 0

  const diff = new Date(endDate).getTime() - new Date(startDate).getTime()

  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-4 border-b border-gray-100 py-4 last:border-none">
      <Icon size={20} className="mt-0.5 shrink-0 text-blue-600" />

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold">{value || "—"}</p>
      </div>
    </div>
  )
}

function ReviewStep({ trip }: Props) {

  const nights = countNights(trip.startDate, trip.endDate)

  const travelers = [
    `${trip.adults} adult${trip.adults === 1 ? "" : "s"}`,
    trip.children > 0
      ? `${trip.children} ${trip.children === 1 ? "child" : "children"} (${trip.childrenAges.join(", ")})`
      : null,
  ].filter(Boolean).join(", ")

  return (
    <>
      <h2 className="text-3xl font-bold">
        Review your trip
      </h2>

      <p className="mt-2 text-gray-500">
        Make sure everything looks right before we plan it.
      </p>

      <div className="mt-8">

        <SummaryRow
          icon={MapPin}
          label="Destination"
          value={trip.destination}
        />

        <SummaryRow
          icon={Plane}
          label="Departure city"
          value={trip.departureCity}
        />

        <SummaryRow
          icon={Calendar}
          label="Dates"
          value={
            trip.startDate && trip.endDate
              ? `${trip.startDate} → ${trip.endDate} (${nights} ${nights === 1 ? "night" : "nights"})`
              : ""
          }
        />

        <SummaryRow
          icon={Users}
          label="Travelers"
          value={travelers}
        />

        <SummaryRow
          icon={Wallet}
          label="Budget"
          value={`${trip.budgetLevel} · €${trip.budget} · ${trip.accommodation}`}
        />

        <SummaryRow
          icon={Compass}
          label="Preferences"
          value={
            [
              trip.interests.length ? `Interests: ${trip.interests.join(", ")}` : null,
              trip.transport.length ? `Transport: ${trip.transport.join(", ")}` : null,
              `Pace: ${trip.pace}`,
              trip.foodPreferences.length ? `Food: ${trip.foodPreferences.join(", ")}` : null,
              trip.accessibility.length ? `Accessibility: ${trip.accessibility.join(", ")}` : null,
            ].filter(Boolean).join(" · ")
          }
        />

        {trip.notes && (
          <SummaryRow
            icon={Compass}
            label="Notes"
            value={trip.notes}
          />
        )}

      </div>
    </>
  )
}

export default ReviewStep
