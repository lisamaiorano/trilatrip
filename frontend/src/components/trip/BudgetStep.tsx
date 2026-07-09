import { Wallet, Coins, Gem, Hotel, Home, Tent, Building2 } from "lucide-react"
import type { Accommodation, BudgetLevel, TripRequest } from "../../types/trip"

import OptionCard from "../ui/OptionCard"
import Counter from "../ui/Counter"

type Props = {
  trip: TripRequest
  setTrip: React.Dispatch<React.SetStateAction<TripRequest>>
}

const budgetLevels: { value: BudgetLevel; label: string; description: string; icon: typeof Wallet }[] = [
  { value: "economy", label: "Economy", description: "Save on the essentials", icon: Wallet },
  { value: "comfort", label: "Comfort", description: "A balanced experience", icon: Coins },
  { value: "luxury", label: "Luxury", description: "Top-tier everything", icon: Gem },
]

const accommodations: { value: Accommodation; label: string; icon: typeof Hotel }[] = [
  { value: "hotel", label: "Hotel", icon: Hotel },
  { value: "airbnb", label: "Airbnb", icon: Home },
  { value: "hostel", label: "Hostel", icon: Building2 },
  { value: "resort", label: "Resort", icon: Tent },
]

function BudgetStep({ trip, setTrip }: Props) {
  return (
    <>
      <h2 className="text-3xl font-bold">
        What's your budget?
      </h2>

      <p className="mt-2 text-gray-500">
        This helps us tailor the trip to your style.
      </p>

      <div className="mt-8 space-y-10">

        <div>
          <label className="mb-3 block font-semibold">Budget level</label>

          <div className="flex flex-col gap-4 sm:flex-row">
            {budgetLevels.map((level) => (
              <OptionCard
                key={level.value}
                label={level.label}
                description={level.description}
                icon={level.icon}
                selected={trip.budgetLevel === level.value}
                onClick={() => setTrip({ ...trip, budgetLevel: level.value })}
              />
            ))}
          </div>
        </div>

        <div>
          <Counter
            label="Total budget (€)"
            value={trip.budget}
            min={0}
            step={100}
            onChange={(value) => setTrip({ ...trip, budget: value })}
          />
        </div>

        <div>
          <label className="mb-3 block font-semibold">Accommodation</label>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {accommodations.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                icon={option.icon}
                selected={trip.accommodation === option.value}
                onClick={() => setTrip({ ...trip, accommodation: option.value })}
              />
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

export default BudgetStep
