import { MapPin, Plane } from "lucide-react";
import type { TripRequest } from "../../types/trip";

type Props = {
  trip: TripRequest;
  setTrip: React.Dispatch<React.SetStateAction<TripRequest>>;
};

function DestinationStep({ trip, setTrip }: Props) {
  return (
    <>
      <h2 className="text-3xl font-bold">
        Where do you want to go?
      </h2>

      <p className="mt-2 text-gray-500">
        Tell us where your adventure begins.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold">
            <MapPin size={20} />
            Destination
          </label>

          <input
            value={trip.destination}
            onChange={(e) =>
              setTrip({
                ...trip,
                destination: e.target.value,
              })
            }
            placeholder="Japan"
            className="w-full rounded-xl border p-4"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold">
            <Plane size={20} />
            Departure city
          </label>

          <input
            value={trip.departureCity}
            onChange={(e) =>
              setTrip({
                ...trip,
                departureCity: e.target.value,
              })
            }
            placeholder="Florence"
            className="w-full rounded-xl border p-4"
          />
        </div>
      </div>
    </>
  );
}

export default DestinationStep;