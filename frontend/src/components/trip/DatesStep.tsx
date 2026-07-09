import { Calendar } from "lucide-react"
import type { TripRequest } from "../../types/trip"

type Props = {
  trip: TripRequest
  setTrip: React.Dispatch<React.SetStateAction<TripRequest>>
}

function countNights(startDate: string, endDate: string) {

  if (!startDate || !endDate) return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  const diff = end.getTime() - start.getTime()

  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
}

function DatesStep({ trip, setTrip }: Props) {

  const nights = countNights(trip.startDate, trip.endDate)

  return (
    <>
      <h2 className="text-3xl font-bold">
        When are you travelling?
      </h2>

      <p className="mt-2 text-gray-500">
        Pick your departure and return dates.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold">
            <Calendar size={20} />
            Start date
          </label>

          <input
            type="date"
            value={trip.startDate}
            onChange={(e) =>
              setTrip({ ...trip, startDate: e.target.value })
            }
            className="w-full rounded-xl border p-4"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold">
            <Calendar size={20} />
            End date
          </label>

          <input
            type="date"
            value={trip.endDate}
            min={trip.startDate || undefined}
            onChange={(e) =>
              setTrip({ ...trip, endDate: e.target.value })
            }
            className="w-full rounded-xl border p-4"
          />
        </div>
      </div>

      {nights > 0 && (
        <p className="mt-6 rounded-xl bg-blue-50 p-4 text-blue-700">
          Your trip will last <strong>{nights}</strong> {nights === 1 ? "night" : "nights"}.
        </p>
      )}
    </>
  )
}

export default DatesStep
