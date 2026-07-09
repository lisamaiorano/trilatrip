import type { TripRequest } from "../../types/trip";

import Counter from "../ui/Counter"

type Props = {
    trip: TripRequest;
    setTrip: React.Dispatch<React.SetStateAction<TripRequest>>;
};

function TravelersStep({ trip, setTrip }: Props) {

    function handleChildrenChange(count: number) {

        setTrip((prev) => {

            const ages = [...prev.childrenAges]

            if (count > ages.length) {
                while (ages.length < count) ages.push(5)
            } else {
                ages.length = count
            }

            return {
                ...prev,
                children: count,
                childrenAges: ages,
            }
        })
    }

    function handleAgeChange(index: number, age: number) {

        setTrip((prev) => {

            const ages = [...prev.childrenAges]
            ages[index] = age

            return {
                ...prev,
                childrenAges: ages,
            }
        })
    }

    return (
        <>
            <h2 className="text-3xl font-bold">
                Who is travelling?
            </h2>

            <p className="mt-2 text-gray-500">
                Tell us who is joining the trip.
            </p>

            <div className="mt-8 space-y-8">

                <div>
                    <Counter
                        label="Adults"
                        value={trip.adults}
                        min={1}
                        onChange={(value) => {
                            setTrip({ ...trip, adults: value })
                        }}
                    />
                </div>

                <div>
                    <Counter
                        label="Children"
                        value={trip.children}
                        min={0}
                        onChange={handleChildrenChange}
                    />
                </div>

                {trip.children > 0 && (
                    <div>
                        <label className="font-semibold">
                            Children ages
                        </label>

                        <div className="mt-3 flex flex-wrap gap-4">
                            {trip.childrenAges.map((age, index) => (
                                <div key={index} className="w-24">
                                    <label className="mb-1 block text-sm text-gray-500">
                                        Child {index + 1}
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        max={17}
                                        value={age}
                                        onChange={(e) =>
                                            handleAgeChange(index, Number(e.target.value))
                                        }
                                        className="w-full rounded-xl border p-3 text-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </>
    );
}

export default TravelersStep;
