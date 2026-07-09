import {
  Leaf,
  Compass,
  Zap,
  User,
  Heart,
  Users,
  UsersRound,
  PlaneTakeoff,
  Train,
  Car,
  Bus,
  Footprints,
} from "lucide-react"
import type { Pace, TripType, TripRequest } from "../../types/trip"

import OptionCard from "../ui/OptionCard"
import Pill from "../ui/Pill"

type Props = {
  trip: TripRequest
  setTrip: React.Dispatch<React.SetStateAction<TripRequest>>
}

const interestOptions = [
  "Culture", "Nature", "Food", "Nightlife", "Shopping", "Relax", "Adventure", "Art", "History", "Beach",
]

const transportOptions: { value: string; label: string; icon: typeof PlaneTakeoff }[] = [
  { value: "flight", label: "Flight", icon: PlaneTakeoff },
  { value: "train", label: "Train", icon: Train },
  { value: "car", label: "Car", icon: Car },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "walking", label: "Walking", icon: Footprints },
]

const paceOptions: { value: Pace; label: string; description: string; icon: typeof Leaf }[] = [
  { value: "relaxed", label: "Relaxed", description: "Take it slow", icon: Leaf },
  { value: "balanced", label: "Balanced", description: "A bit of both", icon: Compass },
  { value: "intensive", label: "Intensive", description: "See it all", icon: Zap },
]

const foodOptions = [
  "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free", "Local cuisine",
]

const accessibilityOptions = [
  "Wheelchair access", "Reduced mobility", "None",
]

const tripTypeOptions: { value: TripType; label: string; icon: typeof User }[] = [
  { value: "solo", label: "Solo", icon: User },
  { value: "couple", label: "Couple", icon: Heart },
  { value: "family", label: "Family", icon: Users },
  { value: "friends", label: "Friends", icon: UsersRound },
]

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

function PreferencesStep({ trip, setTrip }: Props) {
  return (
    <>
      <h2 className="text-3xl font-bold">
        What do you enjoy?
      </h2>

      <p className="mt-2 text-gray-500">
        Help us shape a trip that fits your taste.
      </p>

      <div className="mt-8 space-y-10">

        <div>
          <label className="mb-3 block font-semibold">Who's travelling</label>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {tripTypeOptions.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                icon={option.icon}
                selected={trip.tripType === option.value}
                onClick={() => setTrip({ ...trip, tripType: option.value })}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block font-semibold">Interests</label>

          <div className="flex flex-wrap gap-3">
            {interestOptions.map((interest) => (
              <Pill
                key={interest}
                label={interest}
                selected={trip.interests.includes(interest)}
                onClick={() =>
                  setTrip({ ...trip, interests: toggleValue(trip.interests, interest) })
                }
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block font-semibold">Pace</label>

          <div className="flex flex-col gap-4 sm:flex-row">
            {paceOptions.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                description={option.description}
                icon={option.icon}
                selected={trip.pace === option.value}
                onClick={() => setTrip({ ...trip, pace: option.value })}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block font-semibold">Transport</label>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {transportOptions.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                icon={option.icon}
                selected={trip.transport.includes(option.value)}
                onClick={() =>
                  setTrip({ ...trip, transport: toggleValue(trip.transport, option.value) })
                }
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block font-semibold">Food preferences</label>

          <div className="flex flex-wrap gap-3">
            {foodOptions.map((food) => (
              <Pill
                key={food}
                label={food}
                selected={trip.foodPreferences.includes(food)}
                onClick={() =>
                  setTrip({ ...trip, foodPreferences: toggleValue(trip.foodPreferences, food) })
                }
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block font-semibold">Accessibility needs</label>

          <div className="flex flex-wrap gap-3">
            {accessibilityOptions.map((item) => (
              <Pill
                key={item}
                label={item}
                selected={trip.accessibility.includes(item)}
                onClick={() =>
                  setTrip({ ...trip, accessibility: toggleValue(trip.accessibility, item) })
                }
              />
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block font-semibold">Anything else?</label>

          <textarea
            value={trip.notes}
            onChange={(e) => setTrip({ ...trip, notes: e.target.value })}
            placeholder="Tell us anything else that matters for your trip..."
            rows={4}
            className="w-full rounded-xl border p-4"
          />
        </div>

      </div>
    </>
  )
}

export default PreferencesStep
