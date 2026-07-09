import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TripRequest } from "../types/trip";
import { generateTrip } from "../api/tripApi";

import DestinationStep from "../components/trip/DestinationStep";
import TravelersStep from "../components/trip/TravelersStep";
import DatesStep from "../components/trip/DatesStep";
import BudgetStep from "../components/trip/BudgetStep";
import PreferencesStep from "../components/trip/PreferencesStep";
import ReviewStep from "../components/trip/ReviewStep";

const TOTAL_STEPS = 6;

function isStepValid(step: number, trip: TripRequest) {
  switch (step) {
    case 1:
      return trip.destination.trim() !== "" && trip.departureCity.trim() !== "";
    case 3:
      return trip.startDate !== "" && trip.endDate !== "" && trip.endDate >= trip.startDate;
    default:
      return true;
  }
}

function countNights(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function NewTrip() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const [trip, setTrip] = useState<TripRequest>({
    destination: "",
    departureCity: "",

    startDate: "",
    endDate: "",

    adults: 2,
    children: 0,
    childrenAges: [],

    budget: 0,
    budgetLevel: "comfort",

    accommodation: "hotel",

    transport: [],

    interests: [],

    pace: "balanced",

    foodPreferences: [],

    accessibility: [],

    tripType: "couple",

    notes: "",
  });

  const canProceed = isStepValid(step, trip);

  async function handleGenerate() {
    setError("");
    setGenerating(true);

    try {
      const result = await generateTrip({
        destination: trip.destination,
        departureCity: trip.departureCity,
        days: countNights(trip.startDate, trip.endDate),
        startDate: trip.startDate,
        endDate: trip.endDate,
        adults: trip.adults,
        children: trip.children,
        budget: trip.budget,
        budgetLevel: trip.budgetLevel,
        accommodation: trip.accommodation,
        interests: trip.interests,
        pace: trip.pace,
        foodPreferences: trip.foodPreferences,
        accessibility: trip.accessibility,
        tripType: trip.tripType,
        notes: trip.notes,
      });

      navigate("/trip-result", {
        state: {
          itinerary: result.itinerary,
          raw: result.raw,
          flights: result.flights,
          hotels: result.hotels,
        },
      });
    } catch {
      setError("Something went wrong while generating your trip. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-bold">
          Create your trip ✈️
        </h1>

        <p className="mt-3 text-gray-500">
          Step {step} of {TOTAL_STEPS}
        </p>

        {/* Progress Bar */}
        <div className="mt-6 h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${(step / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>

        {/* Card */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow">

          {step === 1 && (
            <DestinationStep trip={trip} setTrip={setTrip} />
          )}

          {step === 2 && (
            <TravelersStep trip={trip} setTrip={setTrip} />
          )}

          {step === 3 && (
            <DatesStep trip={trip} setTrip={setTrip} />
          )}

          {step === 4 && (
            <BudgetStep trip={trip} setTrip={setTrip} />
          )}

          {step === 5 && (
            <PreferencesStep trip={trip} setTrip={setTrip} />
          )}

          {step === 6 && (
            <ReviewStep trip={trip} />
          )}

          {error && (
            <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </p>
          )}

          {/* Navigation */}

          <div className="mt-10 flex justify-between">

            <button
              disabled={step === 1 || generating}
              onClick={() => setStep(step - 1)}
              className="rounded-xl border px-8 py-4 disabled:opacity-40"
            >
              Back
            </button>

            <button
              disabled={!canProceed || generating}
              onClick={handleNext}
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {generating ? "Generating..." : step === TOTAL_STEPS ? "Generate Trip 🚀" : "Next →"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTrip;
