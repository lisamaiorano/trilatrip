import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">

      <nav className="flex items-center justify-between px-10 py-6">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          TrilaTrip ✈️
        </Link>

        <Link
          to="/dashboard"
          className="rounded-full border border-blue-600 px-6 py-2 text-blue-600"
        >
          Login
        </Link>
      </nav>


      <main className="flex flex-col items-center text-center mt-24 px-6">

        <h2 className="text-6xl font-bold text-gray-900">
          Plan your dream trip
          <span className="text-blue-600">
            {" "}with AI
          </span>
        </h2>


        <p className="mt-6 max-w-xl text-gray-600">
          Create personalized itineraries and discover the world smarter.
        </p>


        <Link
          to="/new-trip"
          className="mt-10 rounded-full bg-emerald-500 px-8 py-4 text-white"
        >
          Start planning 🚀
        </Link>

      </main>

    </div>
  )
}


export default Home
